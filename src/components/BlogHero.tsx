import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

// --- Shader Source: "Cinematic Rain" ---
// A high-fidelity, multi-layered rain effect.
// - Parallax depth (multiple layers moving at different speeds).
// - "Bokeh" transparency (soft glow).
// - Asymmetry and natural variation.
// - Premium "Glass/Tech" aesthetic.

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
uniform vec3 u_color_bg;
uniform vec3 u_color_rain;
uniform float u_is_dark;

// Random
float hash(float n) { return fract(sin(n)*43758.5453); }
float random(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Render a single layer of rain
float renderLayer(vec2 uv, float layerId) {
    // Zoom/Scale based on scale
    float zoom = 10.0 + layerId * 5.0;
    vec2 st = uv * vec2(1.0, 4.0) * zoom; // Stretch vertically

    // Movement
    float speed = 0.5 + layerId * 0.2;
    st.y += u_time * speed;

    // Grid
    vec2 id = floor(st);
    vec2 f = fract(st);

    // Random offset per column
    float n = hash(id.x + layerId * 100.0);

    // Drop logic
    // We want stochastic drops
    float t = u_time * speed;

    // The drop
    // Only some cells have drops
    float hasDrop = step(0.95, hash(id.y * 0.1 + id.x + t * 0.1));

    // Drop shape inside cell
    // Trail
    float drop = smoothstep(1.0, 0.0, f.y) * smoothstep(0.0, 1.0, f.y); // Fade in/out vertical

    // Thin horizontal
    float x = smoothstep(0.4, 0.5, f.x) * smoothstep(0.6, 0.5, f.x);

    // Head pulse
    float brightness = hash(id.y + id.x);

    return x * drop * brightness * hasDrop;
}

// Better Rain Function
float rainDist(vec2 uv, float scale, float speed) {
    uv.x *= 1.0; // Column width
    uv.y += u_time * speed;

    vec2 st = uv * scale;
    vec2 id = floor(st);
    vec2 f = fract(st);

    // Random per cell
    float r = random(id);

    // Animate drop
    // Life cycle of a drop
    float t = u_time * speed + r * 10.0;

    // Make them streak
    float check = step(0.9, random(vec2(id.x, floor(t)))); // 10% chance a column is active per beat? No.

    // Let's do simple streaks
    float drop = 0.0;

    // Column randomization
    float colR = random(vec2(id.x, 0.0));

    // Speed offset per column
    float colSpeed = speed * (0.8 + 0.4 * colR);
    float yBot = -u_time * colSpeed + colR * 10.0; // Falling down

    // Map uv to falling coordinate
    float y = uv.y + yBot;

    // Repeat
    float yFrac = fract(y);
    float yID = floor(y);

    // Random drop length
    float len = 0.1 + 0.2 * random(vec2(id.x, yID));

    // Draw drop
    float d = smoothstep(len, len - 0.05, yFrac) * smoothstep(0.0, 0.02, yFrac);

    // Side fade
    float w = 0.005 + 0.01 * random(vec2(id.x, 1.0)); // varying width
    float xDist = abs(uv.x - (id.x + 0.5)/scale);
    float xMask = smoothstep(w, 0.0, xDist); // Distance to center of column?
    // Actually, simpler:
    xMask = smoothstep(0.4, 0.5, f.x) * smoothstep(0.6, 0.5, f.x);

    return d * xMask;
}

// IQ's Rain simplified
float rain(vec2 uv) {
    vec2 st = uv;
    float aspect = u_resolution.x/u_resolution.y;
    st.x *= aspect;

    float v = 0.0;

    // 3 Layers of depth
    // Layer 1 (Far, slow, dim)
    // Layer 2 (Mid)
    // Layer 3 (Close, fast, bright bokeh)

    // Layer 1
    {
        vec2 p = st;
        p.y += u_time * 0.2;
        p *= 30.0; // Count

        vec2 id = floor(p);
        vec2 f = fract(p);
        float r = random(id);

        // Random drops
        float drop = step(0.97, r); // Few drops
        float trail = smoothstep(1.0, 0.0, f.y);

        v += drop * trail * 0.15; // Dim
    }

    // Layer 2
    {
        vec2 p = st;
        p.y += u_time * 0.5;
        p.x += 12.3; // Offset
        p *= 15.0; // Less count

        vec2 id = floor(p);
        vec2 f = fract(p);
        float r = random(id + 5.0);

        float drop = step(0.96, r);
        float trail = smoothstep(1.0, 0.0, f.y); // Long trail

        v += drop * trail * 0.4;
    }

    // Layer 3 (Hero drops)
    {
        vec2 p = st;
        p.y += u_time * 0.9;
        p.x += 4.5;
        p *= 8.0; // Big

        vec2 id = floor(p);
        vec2 f = fract(p);
        float r = random(id + 10.0); // Flicker?

        // Make them "streak" more using time
        float t = u_time * (0.5 + 0.5*r);
        float flow = floor(t + id.y); // Flow ID

        float streak = step(0.94, random(vec2(id.x, flow)));

        float trail = smoothstep(1.0, 0.0, f.y) * f.y; // Tapered
        trail *= smoothstep(0.0, 0.2, f.y); // Face in at top

        // Bloom shape X
        float w = smoothstep(0.4, 0.5, f.x) * smoothstep(0.6, 0.5, f.x);

        v += streak * trail * w * 0.8;
    }

    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 col = u_color_bg;

    float r = rain(uv);

    vec3 accent = u_color_rain;

    if (u_is_dark < 0.5) {
        // Light Mode
        // Dark rain on light BG
        // Invert mask
        col = mix(col, accent, r * 1.5); // strengthen color
    } else {
        // Dark Mode
        // Additive glow
        col += accent * r * 1.2;
    }

    // Vignette
    float vig = 1.0 - length(uv - 0.5) * 0.6;
    col = mix(col, u_color_bg, 1.0 - smoothstep(0.0, 1.2, vig));

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
    bg: [0.98, 0.99, 1.0], // Crisp White
    rain: [0.0, 0.3, 0.7], // Corporate Blue
  },
  dark: {
    bg: [0.03, 0.04, 0.06], // Deep Black-Blue
    rain: [0.0, 0.8, 1.0], // Electric Cyan
  },
};

export default function BlogHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("BlogHero: Canvas ref missing");
      return;
    }

    const gl = canvas.getContext("webgl");
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
    const uBg = gl.getUniformLocation(program, "u_color_bg");
    const uRain = gl.getUniformLocation(program, "u_color_rain");
    const uIsDark = gl.getUniformLocation(program, "u_is_dark");

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      // Robust resizing
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      const time = (Date.now() - startTime) / 1000;
      const colors = isDark ? THEME.dark : THEME.light;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, displayWidth, displayHeight);
      gl.uniform3fv(uBg, colors.bg);
      gl.uniform3fv(uRain, colors.rain);
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
      className="absolute inset-0 w-full h-full"
      style={{
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
