import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

/**
 * LiquidMetalShader
 * A high-end, fashion-forward WebGL background.
 * Simulates flowing liquid metal (Light Mode) or iridescent oil (Dark Mode).
 */

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_is_dark;

// --- Simplex Noise 2D ---
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// --- FBM (Fractal Brownian Motion) ---
float fbm(vec2 st) {
    float value = 0.0;
    float amp = 0.5;
    // PERFORMANCE: Reduces octaves from 4 to 3
    for (int i = 0; i < 3; i++) {
        value += amp * snoise(st);
        st *= 2.0;
        amp *= 0.5;
    }
    return value;
}

// --- Domain Warping ---
float pattern(in vec2 p, out vec2 q, out vec2 r) {
    q.x = fbm(p + vec2(0.0, 0.0));
    q.y = fbm(p + vec2(5.2, 1.3));

    r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2));
    r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8));

    return fbm(p + 4.0 * r);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Mouse Influence
    vec2 mouse = u_mouse * u_resolution.xy / u_resolution.y;
    float dist = length(st - mouse);
    // Push the fluid away from mouse
    st += normalize(st - mouse) * 0.05 * smoothstep(0.5, 0.0, dist);

    // Time scaling
    float t = u_time * 0.2;

    vec2 q = vec2(0.);
    vec2 r = vec2(0.);

    // Calculate fluid noise pattern
    float f = pattern(st * 3.0 + t * 0.1, q, r);

    // Color Palette
    vec3 color = vec3(0.0);

    if (u_is_dark > 0.5) {
        // Dark Mode: Iridescent Oil Slick (Deep Purple, Cyan, Green)
        color = mix(vec3(0.1, 0.1, 0.1), vec3(0.1, 0.0, 0.2), clamp(q.x, 0.0, 1.0));
        color = mix(color, vec3(0.0, 0.6, 0.8), clamp(r.x, 0.0, 1.0)); // Cyan
        color = mix(color, vec3(0.8, 0.0, 0.4), clamp(f, 0.0, 1.0));   // Magenta ripple

        // Specular highlights for "wet" look
        float spec = pow(f, 4.0);
        color += vec3(0.8) * spec * 0.5;

    } else {
        // Light Mode: Mercury / Liquid Silver
        // Base is white/grey
        color = mix(vec3(0.9, 0.92, 0.95), vec3(0.7, 0.75, 0.8), clamp(q.x, 0.0, 1.0));
        color = mix(color, vec3(1.0, 1.0, 1.0), clamp(r.x, 0.0, 1.0));

        // Metallic sheen
        float metallic = f * f * (3.0 - 2.0 * f);
        color = mix(color, vec3(0.6, 0.7, 0.9), metallic * 0.3); // Slight blue tint

        // High specular
        float spec = pow(f, 8.0);
        color += vec3(1.0) * spec * 0.8;
    }

    // Vignette
    float vig = 1.0 - smoothstep(0.0, 1.5, length(st - 0.5));
    // color *= vig; // Optional

    gl_FragColor = vec4(color, 1.0);
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
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const LiquidMetalShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // PERFORMANCE: Explicitly disable alpha/depth/stencil/antialias
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uIsDark = gl.getUniformLocation(program, "u_is_dark");

    let animationId: number;
    const startTime = Date.now();

    const resize = () => {
      // PERFORMANCE: Cap DPR at 1.0 (Retina screens get standard res)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);

      // OPTIONAL: Downscale further on mobile if still slow
      // const dpr =  window.innerWidth < 768 ? 0.75 : 1.0;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Smooth mouse
      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default LiquidMetalShader;
