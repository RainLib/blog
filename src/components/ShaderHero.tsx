import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

// --- Shader Source: "Ethereal Flow" ---
// A smooth, liquid-like FBM gradient flow.

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
uniform vec3 u_color_1;
uniform vec3 u_color_2;
uniform vec3 u_color_3; // Added a 3rd accent color

// Random function
float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Noise
float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Fractal Brownian Motion (FBM)
#define NUM_OCTAVES 5

float fbm( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 0.05; // Slow, majestic movement

    // Mouse Interaction (Subtle Warp)
    // Only apply if mouse is within valid range (simple check handled by JS)
    vec2 mouseEffect = (u_mouse - 0.5) * 0.2;

    // Pattern generation: Domain Warping
    // q = FBM(st + mouse)
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.05*time + mouseEffect.x); // Restored time factor
    q.y = fbm( st + vec2(1.0) + mouseEffect.y);

    // r = FBM(st + 4.0*q + time)
    vec2 r = vec2(0.);
    r.x = fbm( st + 4.0*q + vec2(1.7,9.2)+ 0.15*time );
    r.y = fbm( st + 4.0*q + vec2(8.3,2.8)+ 0.126*time);

    // Final noise value
    float f = fbm(st + 4.0*r);

    // Color Mixing based on the noise value 'f' and 'q'/'r' vectors
    // 1. Base Gradient
    vec3 color = mix(u_color_bg, u_color_1, clamp(f*f*4.0, 0.0, 1.0));

    // 2. Add Secondary Flows
    color = mix(color, u_color_2, clamp(length(q), 0.0, 1.0));

    // 3. Add Accent Highlights
    color = mix(color, u_color_3, clamp(length(r.x), 0.0, 1.0));

    // Enhance contrast of the "waves"
    color = pow(color, vec3(0.9)); // Slightly brighten

    // Vignette
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float vig = 1.0 - length(uv - 0.5) * 0.5;
    // Don't make it too dark
    color = mix(color, u_color_bg, (1.0 - vig) * 0.5);

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

// --- Theme Config (Updated for "Ethereal" Look) ---
const THEME = {
  light: {
    bg: [0.98, 0.98, 0.99], // Very Near White
    c1: [0.85, 0.93, 1.0], // Ethereal Blue
    c2: [0.95, 0.9, 1.0], // Soft Lavender
    c3: [0.7, 0.85, 0.95], // Accent Sky
  },
  dark: {
    bg: [0.02, 0.02, 0.03], // Void Black
    c1: [0.05, 0.1, 0.2], // Deep Ocean
    c2: [0.15, 0.05, 0.25], // Deep Galaxy
    c3: [0.0, 0.2, 0.25], // Aurora Teal
  },
};

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Track mouse position
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 }); // For smoothing

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Calculate mouse relative to canvas
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // Invert Y

      targetMouseRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      // Optional: Reset to center or keep last position?
      // Let's drift back to center for "no interaction" state
      targetMouseRef.current = { x: 0.5, y: 0.5 };
    };

    // Attach to canvas (or window if we want global effect)
    // User requested "only interactive when mouse is in current area" -> Attach to canvas
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
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
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    // Color Uniforms
    const uBg = gl.getUniformLocation(program, "u_color_bg");
    const uC1 = gl.getUniformLocation(program, "u_color_1");
    const uC2 = gl.getUniformLocation(program, "u_color_2");
    const uC3 = gl.getUniformLocation(program, "u_color_3");

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

      // Smooth mouse interpolation
      // Lerp factor (0.05 for slow smooth catchup)
      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      gl.uniform1f(uTimeDetails, time);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y); // Pass mouse pos

      gl.uniform3fv(uBg, colors.bg);
      gl.uniform3fv(uC1, colors.c1);
      gl.uniform3fv(uC2, colors.c2);
      gl.uniform3fv(uC3, colors.c3);

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
