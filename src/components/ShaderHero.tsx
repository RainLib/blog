import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

// --- Shader Source: "Cyber-Lattice" ---
// A structured, high-tech geometric web.
// - Rigid, hexagonal/triangular lattice structure.
// - Not random noise, but "computed" geometry.
// - Deep perspective (faked 3D layer stack).
// - Energetic pulses traveling along connections.
// - Light Mode: Technical Blueprint (Grey/Blue, clean lines).
// - Dark Mode: Cyber Core (Neon Cyan/Purple, glowing nodes).

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
uniform vec3 u_color_bg;
uniform vec3 u_color_grid;
uniform vec3 u_color_accent;
uniform float u_is_dark;

#define PI 3.14159265359

// Hexagon Grid Logic
// Returns: vec4(x_center, y_center, distance_to_center, unique_id)
vec4 hexCoords(vec2 uv) {
    vec2 r = vec2(1.0, 1.732);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;

    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    vec2 id = uv - gv;
    return vec4(gv.x, gv.y, length(gv), id.x + id.y * 100.0); // Simple ID
}

// 2D Rotation
mat2 rot2d(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 mouse = (u_mouse - 0.5) * vec2(u_resolution.x/u_resolution.y, 1.0);

    vec3 col = u_color_bg;

    // Camera / Global Movement
    // Slowly rotating and zooming
    vec2 camUV = uv * rot2d(u_time * 0.05);
    float zoom = 8.0 + sin(u_time * 0.1) * 2.0;

    // --- Layer 1: The Lattice (Main Structure) ---
    vec2 gridUV = camUV * zoom;
    vec4 hex = hexCoords(gridUV);
    vec2 gv = hex.xy;
    float id = hex.w;

    // Distance to edge of hex (for lines)
    // Hexagon math: max(abs(x), x*0.5 + y*0.866)
    float dHex = max(abs(gv.x), dot(abs(gv), vec2(0.5, 0.866)));
    // Invert: 0 at center, 0.5 at edge.
    // Line width
    float lineWidth = 0.03;
    float line = smoothstep(0.48, 0.5 - lineWidth, dHex) * smoothstep(0.5, 0.48 + lineWidth, dHex);
    // Actually simpler: Make edges glow
    float glow = 0.02 / abs(dHex - 0.5);
    glow = pow(glow, 1.5);

    // Node Activity (Pulsing)
    float pulse = sin(id * 123.4 + u_time * 2.0) * 0.5 + 0.5;
    float activity = smoothstep(0.8, 1.0, pulse); // Only some turn on

    // Mouse Interaction
    // "Excites" the lattice
    float dMouse = length(uv - mouse);
    float mouseExcitement = smoothstep(0.4, 0.0, dMouse) * 2.0;
    activity += mouseExcitement;

    // --- Composition ---
    vec3 latticeCol = u_color_grid;

    // 1. Edges
    // Light Mode: Dark lines. Dark Mode: Glowing lines.
    if (u_is_dark > 0.5) {
        col += latticeCol * glow * 0.5;
    } else {
        // Light: Mix dark lines
        float edgeAlpha = smoothstep(0.45, 0.5, dHex);
        col = mix(col, latticeCol, edgeAlpha * 0.5);
    }

    // 2. Nodes (Hex Centers)
    // Small dots at center
    float nodeDot = 0.05 / length(gv);
    nodeDot *= smoothstep(0.1, 0.05, length(gv)); // soft edge

    vec3 nodeCol = mix(u_color_grid, u_color_accent, activity);

    if (u_is_dark > 0.5) {
         col += nodeCol * nodeDot;
         // Active nodes bloom
         col += u_color_accent * activity * nodeDot * 2.0;

         // Fill Hex (Low opacity) for active ones
         float fill = smoothstep(0.5, 0.4, dHex);
         col += u_color_accent * fill * activity * 0.1;
    } else {
         // Light Mode
         float dotShape = smoothstep(0.1, 0.0, length(gv));
         col = mix(col, nodeCol, dotShape * (0.5 + activity * 0.5));
    }

    // --- Layer 2: Floating Data Particles (Depth) ---
    // A second hex grid, larger, rotated, barely visible
    vec2 uv2 = uv * rot2d(-u_time * 0.1) * 3.0;
    vec4 hex2 = hexCoords(uv2);
    float dHex2 = max(abs(hex2.x), dot(abs(hex2.xy), vec2(0.5, 0.866)));
    float line2 = smoothstep(0.48, 0.5, dHex2); // Just Lines

    if (u_is_dark > 0.5) {
        col += u_color_accent * (0.01 / abs(dHex2 - 0.5)) * 0.2;
    } else {
        col = mix(col, u_color_accent, smoothstep(0.49, 0.5, dHex2) * 0.1);
    }

    // --- Vignette & Atmosphere ---
    float vig = 1.0 - length(uv * 0.8);
    col = mix(col, u_color_bg, 1.0 - smoothstep(0.0, 1.5, vig));

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
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const THEME = {
  light: {
    bg: [0.96, 0.97, 0.99], // Tech White
    grid: [0.2, 0.3, 0.4], // Slate Blue Lines
    accent: [0.0, 0.4, 0.9], // Electric Blue Active
  },
  dark: {
    bg: [0.03, 0.03, 0.05], // Void Black
    grid: [0.0, 0.3, 0.4], // Dark Teal Lines
    accent: [0.0, 0.9, 1.0], // Neon Cyan Active
  },
};

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouseRef.current = { x, y };
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
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
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uBg = gl.getUniformLocation(program, "u_color_bg");
    const uGrid = gl.getUniformLocation(program, "u_color_grid");
    const uAccent = gl.getUniformLocation(program, "u_color_accent");
    const uIsDark = gl.getUniformLocation(program, "u_is_dark");

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      const time = (Date.now() - startTime) / 1000;
      const colors = isDark ? THEME.dark : THEME.light;

      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform3fv(uBg, colors.bg);
      gl.uniform3fv(uGrid, colors.grid);
      gl.uniform3fv(uAccent, colors.accent);
      gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 transition-opacity duration-1000"
      style={{ display: "block" }}
    />
  );
}
