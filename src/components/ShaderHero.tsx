import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform float u_is_dark; // 0.0 for light, 1.0 for dark
out vec4 fragColor;

// -13 thanks to Nguyen2007 ⚡

void mainImage( out vec4 o, vec2 u )
{
    vec2 v = iResolution.xy;
         u = .2*(u+u-v)/v.y;

    // Use different start phase for colors (RGB)
    // Dark: vec4(3.0, 4.0, 5.0, 0.0) -> Cool blues/purples
    // Light: vec4(1,2,3,0) -> Original
    vec4 z = u_is_dark > 0.5 ? vec4(3.0, 4.0, 5.0, 0.0) : vec4(1,2,3,0);
    o = z;

    for (float a = .5, t = iTime, i;
         ++i < 8.; // Reduced from 12 to 8 for performance
         o += (1. + cos(z+t))
            / length((1.+i*dot(v,v))
                   * sin(1.5*u/(.5-dot(u,u)) - 9.*u.yx + t))
         )
        v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u,
        // use stanh here if shader has black artifacts
        //   vvvv
        u += tanh(40. * dot(u *= mat2(cos(i + .02*t - z.wxzw*11.))
                           ,u)
                      * cos(1e2*u.yx + t)) / 2e2
           + .2 * a * u
           + cos(4./exp(dot(o,o)/1e2) + t) / 3e2;

     // Calculate brightness factor
     // Light Mode = 25.6 (Original)
     // Dark Mode  = 14.0 (Brighter) e.g., was 8.0
     float brightness = u_is_dark > 0.5 ? 14.0 : 25.6;

     // Original formula with configurable brightness
     o = brightness / (min(o, 13.) + 164. / o)
       - dot(u, u) / 250.;
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
    fragColor.a = 1.0;
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isVisibleRef = useRef(false);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const cleanupRef = useRef<() => void>(null); // To store the cleanup function created inside idle callback

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Defer initialization to unblock main thread using requestIdleCallback
    const initShader = () => {
      // Try WebGL 2 first
      const gl = canvas.getContext("webgl2", {
        powerPreference: "default", // Changed from high-performance to avoid slow GPU switching
        antialias: false,
        alpha: false,
        depth: false,
      });

      if (!gl) {
        console.error("WebGL 2 not supported");
        return;
      }

      const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vert || !frag) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return;
      }

      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]),
        gl.STATIC_DRAW,
      );

      const positionLocation = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const iTimeLoc = gl.getUniformLocation(program, "iTime");
      const iResolutionLoc = gl.getUniformLocation(program, "iResolution");
      const uIsDarkLoc = gl.getUniformLocation(program, "u_is_dark");

      let animationFrameId: number;
      let isRendering = false;

      const drawScene = () => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
        lastFrameTimeRef.current = currentTime;

        // Cap delta time to prevent huge jumps if tab was inactive
        // or if resuming from a long pause (though we reset on resume)
        const safeDelta = Math.min(deltaTime, 0.1);

        timeRef.current += safeDelta;

        gl.uniform1f(iTimeLoc, timeRef.current);
        gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, 1.0);

        // Pass the dark mode uniform...
        gl.uniform1f(uIsDarkLoc, isDark ? 1.0 : 0.0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const render = () => {
        if (!isRendering) return;
        drawScene();
        animationFrameId = requestAnimationFrame(render);
      };

      const stopLoop = () => {
        isRendering = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };

      const startLoop = () => {
        if (!isRendering && isVisibleRef.current) {
          isRendering = true;
          // Important: Reset last frame time on resume so we don't jump
          lastFrameTimeRef.current = Date.now();
          render();
        }
      };

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // PERFORMANCE: Cap at 1.0 (no retina) for speed. Shader is soft anyway.
          const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;

          const displayWidth = Math.round(width * dpr);
          const displayHeight = Math.round(height * dpr);

          if (
            canvas.width !== displayWidth ||
            canvas.height !== displayHeight
          ) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            gl.viewport(0, 0, displayWidth, displayHeight);
            // Force a draw but don't advance time here to avoid jump
            drawScene();
          }
        }
      });

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          setTimeout(() => {
            entries.forEach((entry) => {
              isVisibleRef.current = entry.isIntersecting;
              if (entry.isIntersecting) {
                startLoop();
              } else {
                stopLoop();
              }
            });
          }, 0);
        },
        { threshold: 0.0 },
      );

      // Start the loop
      resizeObserver.observe(canvas);
      intersectionObserver.observe(canvas);

      // Cleanup function specifically for the GL context and observers
      // We attach this to the canvas element or store it in a ref if needed,
      // but here we are inside the closure. The main useEffect cleanup needs to handle this.
      // Since we can't easily export this cleanup out of the callback,
      // we'll store it in a mutable ref.
      cleanupRef.current = () => {
        if (isRendering && animationFrameId)
          cancelAnimationFrame(animationFrameId);
        isRendering = false;
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
      };
    };

    const handle = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(initShader, { timeout: 2000 })
      : setTimeout(initShader, 100);

    return () => {
      if ((window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
      // Call the cleanup function if it was assigned
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [isDark]); // Re-run effect when theme changes to ensure unrelated state is clean

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
