import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

/**
 * VoidShader: A premium WebGL background for the 404 page.
 * Features:
 * - Gravitational Vortex (Mouse-reactive)
 * - Starfield Distortion
 * - Digital Glitch scanlines
 * - Cosmic color palette
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

// --- Utilities ---
mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// --- Void Effect ---
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 m = (u_mouse - 0.5) * (u_resolution.xy / min(u_resolution.y, u_resolution.x));

    // Smoothly pull toward mouse
    vec2 p = uv - m;
    float d = length(p);

    // Gravitational lensing / Distortion
    float strength = 0.2 / (d + 0.1);
    vec2 distortedUV = uv + normalize(p) * strength * 0.5;

    // Swirl
    float angle = atan(p.y, p.x);
    float swirl = sin(d * 10.0 - u_time * 2.0) * 0.1;
    distortedUV *= rot(swirl / (d + 0.5));

    // Base Colors
    vec3 col_void = u_is_dark > 0.5 ? vec3(0.02, 0.01, 0.05) : vec3(0.95, 0.95, 0.98);
    vec3 col_glow = u_is_dark > 0.5 ? vec3(0.4, 0.0, 0.8) : vec3(0.6, 0.7, 1.0);

    // Starfield Layer
    float stars = pow(hash(floor(distortedUV * 100.0)), 20.0);
    stars *= sin(u_time * 2.0 + hash(floor(distortedUV * 100.0)) * 6.28) * 0.5 + 0.5;

    // Combine
    vec3 col = mix(col_void, col_glow, pow(strength, 2.0));
    col += stars * (u_is_dark > 0.5 ? 0.3 : 0.1);

    // Digital Glitch Scanlines
    float scanline = sin(gl_FragCoord.y * 0.5 + u_time * 10.0) * 0.02;
    if (hash(vec2(u_time)) > 0.98) {
        col += scanline * 2.0;
        col.rb *= 1.2;
    }

    // Vignette
    float vig = smoothstep(1.0, 0.2, length(uv * 0.8));
    col *= vig;

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
    console.warn("VoidShader Error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const VoidShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMousePos.current = {
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

    const gl = canvas.getContext("webgl", { alpha: false });
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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Smooth mouse follow
      mousePos.current.x +=
        (targetMousePos.current.x - mousePos.current.x) * 0.1;
      mousePos.current.y +=
        (targetMousePos.current.y - mousePos.current.y) * 0.1;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
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
        zIndex: 0,
        filter: isDark ? "none" : "brightness(1.05) contrast(0.95)", // Slightly soften for light mode
      }}
    />
  );
};

export default VoidShader;
