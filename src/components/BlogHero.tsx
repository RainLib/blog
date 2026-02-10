import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

// --- Shader Source: "Breathing Aurora" ---
// Ultra-lightweight background.
// - NO LOOPS. NO NOISE.
// - Just 3 sine waves mixing colors.
// - 60fps guaranteed even on mobile.
// - Visual: Soft, slow-moving gradient fog.

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float; // Medium precision is enough for smooth gradients

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Slow down time significantly
    float t = u_time * 0.2;

    // Create 3 moving points/blobs based on simple Trig
    vec2 p1 = vec2(0.5 + 0.5*sin(t), 0.5 + 0.5*cos(t*0.7));
    vec2 p2 = vec2(0.5 + 0.5*sin(t*1.2 + 2.0), 0.5 + 0.5*cos(t*1.5 + 1.0));
    vec2 p3 = vec2(0.5 + 0.5*sin(t*0.5 + 4.0), 0.5 + 0.5*cos(t*0.3 + 2.0));

    // Distances
    float d1 = length(uv - p1);
    float d2 = length(uv - p2);
    float d3 = length(uv - p3);

    // Soft mixing
    vec3 col = u_c1;
    col = mix(col, u_c2, smoothstep(0.8, 0.2, d1)); // Blob 1
    col = mix(col, u_c3, smoothstep(0.8, 0.2, d2 * 1.2)); // Blob 2

    // Add a ambient light wave at bottom
    float bottomWave = 0.5 + 0.5 * sin(uv.x * 6.0 + t * 2.0);
    col = mix(col, u_c2, bottomWave * smoothstep(0.0, 0.4, 1.0 - uv.y) * 0.3);

    // Subtle grain to prevent banding
    float grain = fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453) * 0.02;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("BlogHero Shader Error:", gl.getShaderInfoLog(shader)); // Changed to warn to see in console
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const THEME = {
  light: {
    bg: [1.0, 1.0, 1.0], // Pure White
    c1: [0.92, 0.94, 1.0], // Very soft Indigo
    c2: [0.95, 0.96, 0.98], // Cool Grey/White
    c3: [0.9, 0.96, 1.0], // Pale Cyan hint
  },
  dark: {
    bg: [0.02, 0.02, 0.03], // Almost Pure Black (OLED friendly)
    c1: [0.08, 0.1, 0.18], // Deep Midnight
    c2: [0.05, 0.05, 0.08], // Dark Slate
    c3: [0.06, 0.15, 0.2], // Deep Teal/Ocean
  },
};

const BlogHero = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("BlogHero: Canvas ref missing");
      return;
    }

    // PERFORMANCE: Optimize context attributes
    // - alpha: false (we draw full screen opaque, lets browser optimize compositing)
    // - depth: false (2D shader, no depth buffer needed)
    // - antialias: false (pixel look is fine/better for performance)
    const gl = canvas.getContext("webgl", {
      alpha: true, // Need true for transparency to mingle with page if needed, but false is faster
      depth: false,
      antialias: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error("BlogHero: WebGL failed to initialize");
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

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");
    const uC3 = gl.getUniformLocation(program, "u_c3");

    let animationFrameId: number;
    const startTime = Date.now();

    // PERFORMANCE: Use ResizeObserver to avoid polling clientWidth/Height in the loop
    // This prevents layout thrashing during scroll
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const displayWidth = entry.contentRect.width;
        const displayHeight = entry.contentRect.height;

        // AGGRESSIVE OPTIMIZATION: Render at LOWER resolution
        // 0.5 means we render 1/4th the pixels.
        // For a blurry/rain background, this is usually acceptable and makes scrolling silky smooth.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.0) * 0.5;

        canvas.width = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    });

    resizeObserver.observe(canvas);

    const render = () => {
      const time = (Date.now() - startTime) / 1000;
      const colors = isDark ? THEME.dark : THEME.light;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform3fv(uC1, colors.c1);
      gl.uniform3fv(uC2, colors.c2);
      gl.uniform3fv(uC3, colors.c3);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        display: "block",
        pointerEvents: "none",
        transform: "translateZ(0)", // Force GPU layer
        willChange: "transform", // Hint browser to optimize
      }}
    />
  );
});

export default BlogHero;
