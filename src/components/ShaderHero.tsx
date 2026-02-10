import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

// --- Shader Source ---

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
uniform vec2 u_mouse; // Mouse position (normalized)
uniform vec3 u_color_bg;
uniform vec3 u_color_1;
uniform vec3 u_color_2;

// Simplex 2D noise
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

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.1;

    // Mouse Interaction
    // Calculate distance to mouse
    float dist = distance(st, u_mouse * vec2(u_resolution.x / u_resolution.y, 1.0));
    float interaction = smoothstep(0.5, 0.0, dist) * 0.1; // Local distortion

    // Domain Warping with Interaction
    float n1 = snoise(st * 1.5 + t + interaction);
    float n2 = snoise(st * 3.0 - t * 1.5 + n1 + interaction * 2.0);

    // Color mixing based on noise
    vec3 color = mix(u_color_bg, u_color_1, smoothstep(-0.5, 0.5, n1));
    color = mix(color, u_color_2, smoothstep(-0.5, 0.5, n2) * 0.8);

    // Vignette
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float vig = 1.0 - length(uv - 0.5) * 0.5;
    color *= vig;

    gl_FragColor = vec4(color, 1.0);
}
`;

// --- Utility: Compile Shader ---
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

// --- Theme Config ---
const THEME = {
  light: {
    bg: [0.96, 0.96, 0.97], // #f5f5f7 (Warm Grey)
    c1: [0.8, 0.9, 1.0], // Soft Blue
    c2: [1.0, 0.9, 0.9], // Soft Peach
  },
  dark: {
    bg: [0.04, 0.05, 0.06], // #0b0c10 (Deep Space)
    c1: [0.1, 0.2, 0.3], // Muted Deep Blue
    c2: [0.2, 0.1, 0.2], // Muted Deep Purple
  },
};

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Track mouse position
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight, // Invert Y for WebGL
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Create Shaders
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    // Create Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    gl.useProgram(program);

    // Buffer: Full screen triangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTimeDetails = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse"); // New Uniform

    // Color Uniforms
    const uBg = gl.getUniformLocation(program, "u_color_bg");
    const uC1 = gl.getUniformLocation(program, "u_color_1");
    const uC2 = gl.getUniformLocation(program, "u_color_2");

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

      gl.uniform1f(uTimeDetails, time);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y); // Pass mouse pos
      gl.uniform3fv(uBg, colors.bg);
      gl.uniform3fv(uC1, colors.c1);
      gl.uniform3fv(uC2, colors.c2);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // ... (cleanup) ...

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [isDark]); // Re-init shader when theme changes (or we could just update uniforms, but re-init is safer for clean state here)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 transition-opacity duration-1000"
      style={{ display: "block" }}
    />
  );
}
