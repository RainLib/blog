import React, { useEffect, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";

// --- Shader Source: "ASCII Tunnel" ---
// Concept: Retro-futuristic ASCII art tunnel.
// Features: bitmap font, bayer dithering, mouse steering.

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
uniform vec3 u_color_fg;
uniform float u_is_dark;

// --- Configuration ---
#define CELL_SIZE 8.0
#define FOG_DENSITY 0.06
#define DITHER_AMOUNT 0.15

// --- Bitmap Font (5x7) compacted ---
// We can't do full huge arrays easily in WebGL1 without textures,
// so we'll use a procedural approach or a simplified font.
// A simple 3x5 or 4x6 font function is efficient here.

float getBit(int num, int idx) {
    // GLSL ES 1.0 doesn't support bitwise operators easily on all platforms
    // dividing by powers of 2 simluates right shift
    float p = pow(2.0, float(idx));
    return mod(floor(float(num) / p), 2.0);
}

// Minimal 4x5 font for efficiency
float char(int ch, vec2 p) {
    // p is 0..1 in the char cell
    if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 0.0;

    // Grid positions (4x5)
    int x = int(p.x * 4.0);
    int y = int(p.y * 5.0);
    int idx = x + (4 - 1 - y) * 4; // 0..19

    // Data for characters (simplified set)
    // 0: @, 1: #, 2: %, 3: *, 4: =, 5: -, 6: :, 7: .
    int bits = 0;

    if (ch == 0) bits = 970054; // @ (approx)
    if (ch == 1) bits = 445354; // #
    if (ch == 2) bits = 862550; // %
    if (ch == 3) bits = 143924; // *
    if (ch == 4) bits = 491520; // = (top/bot lines)
    if (ch == 5) bits = 3840;   // -
    if (ch == 6) bits = 163820; // :
    if (ch == 7) bits = 32;     // .

    return getBit(bits, idx);
}

// Improved Font Function (Procedural Shapes instead of bits for stability)
float getCharPixel(int ch, vec2 uv) {
    float d = 0.0;
    // .
    if (ch >= 7) {
        if (length(uv - 0.5) < 0.1) d = 1.0;
    }
    // :
    else if (ch == 6) {
        if (length(uv - vec2(0.5, 0.3)) < 0.1) d = 1.0;
        if (length(uv - vec2(0.5, 0.7)) < 0.1) d = 1.0;
    }
    // -
    else if (ch == 5) {
        if (abs(uv.y - 0.5) < 0.1 && abs(uv.x - 0.5) < 0.3) d = 1.0;
    }
    // =
    else if (ch == 4) {
        if (abs(uv.y - 0.3) < 0.05 && abs(uv.x - 0.5) < 0.3) d = 1.0;
        if (abs(uv.y - 0.7) < 0.05 && abs(uv.x - 0.5) < 0.3) d = 1.0;
    }
    // +
    else if (ch == 3) {
        if (abs(uv.y - 0.5) < 0.05 || abs(uv.x - 0.5) < 0.05) d = 1.0;
    }
    // *
    else if (ch == 2) {
        if (abs(uv.y - 0.5) < 0.05 || abs(uv.x - 0.5) < 0.05) d = 1.0;
        if (abs(uv.x - uv.y) < 0.05 || abs(uv.x - (1.0 - uv.y)) < 0.05) d = 1.0;
    }
    // #
    else if (ch == 1) {
       if (abs(uv.x - 0.3) < 0.05 || abs(uv.x - 0.7) < 0.05) d = 1.0;
       if (abs(uv.y - 0.3) < 0.05 || abs(uv.y - 0.7) < 0.05) d = 1.0;
    }
    // @ (Fill)
    else {
        if (length(uv - 0.5) < 0.4) d = 1.0;
    }
    return d;
}


// --- 4x4 Bayer Dither ---
float bayer4(vec2 p) {
    vec2 c = floor(mod(p, 4.0));
    float idx = c.x + c.y * 4.0;

    if (idx < 0.5) return 0.0/16.0;
    if (idx < 1.5) return 8.0/16.0;
    if (idx < 2.5) return 2.0/16.0;
    if (idx < 3.5) return 10.0/16.0;
    if (idx < 4.5) return 12.0/16.0;
    if (idx < 5.5) return 4.0/16.0;
    if (idx < 6.5) return 14.0/16.0;
    if (idx < 7.5) return 6.0/16.0;
    if (idx < 8.5) return 3.0/16.0;
    if (idx < 9.5) return 11.0/16.0;
    if (idx < 10.5) return 1.0/16.0;
    if (idx < 11.5) return 9.0/16.0;
    if (idx < 12.5) return 15.0/16.0;
    if (idx < 13.5) return 7.0/16.0;
    if (idx < 14.5) return 13.0/16.0;
    return 5.0/16.0;
}

// --- Tunnel Math ---
vec2 tunnelPath(float z) {
    // Mouse Interaction: Mouse X controls X bend, Mouse Y controls Y bend
    // u_mouse is 0..1
    float bendX = (u_mouse.x - 0.5) * 6.0;
    float bendY = (u_mouse.y - 0.5) * 6.0;

    return vec2(
        sin(z * 0.15) * bendX + cos(z * 0.07) * bendX * 0.6,
        cos(z * 0.11) * bendY + sin(z * 0.19) * bendY * 0.6
    );
}

float tunnelSDF(vec3 p) {
    vec2 offset = tunnelPath(p.z);
    return 1.6 - length(p.xy - offset); // Radius
}

vec3 renderScene(vec2 uv, float time) {
    float speed = 6.0;
    float t = time * speed;

    // Camera
    vec3 ro = vec3(tunnelPath(t), t);
    vec3 target = vec3(tunnelPath(t + 2.0), t + 2.0);
    vec3 fwd = normalize(target - ro);
    vec3 right = normalize(cross(vec3(0, 1, 0), fwd));
    vec3 up = cross(fwd, right);

    vec3 rd = normalize(right * uv.x + up * uv.y + fwd * 0.9);

    // Raymarch
    float totalDist = 0.0;
    vec3 p = ro;
    bool hit = false;

    for(int i=0; i<60; i++) {
        p = ro + rd * totalDist;
        float d = tunnelSDF(p);
        if(d < 0.01) { hit = true; break; }
        totalDist += d * 0.6; // step size
        if(totalDist > 50.0) break;
    }

    if(!hit) return vec3(0.0);

    // Shading
    vec2 wOff = tunnelPath(p.z);
    vec2 locXY = p.xy - wOff;
    float angle = atan(locXY.y, locXY.x);

    // Pattern on wall
    float grid = sin(angle * 10.0 + p.z * 0.5) * sin(p.z * 2.0);
    float val = smoothstep(0.0, 0.1, grid);

    // Depth Fog
    float fog = exp(-totalDist * FOG_DENSITY);

    return vec3(val * fog);
}

void main() {
    // Pixelate UV for "Screen" effect
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 cell = floor(fragCoord / CELL_SIZE);
    vec2 cellCenter = (cell + 0.5) * CELL_SIZE;

    vec2 uv = (cellCenter - 0.5 * u_resolution.xy) / u_resolution.y;

    // Render Scene (Luminance)
    vec3 col = renderScene(uv, u_time);
    float lum = dot(col, vec3(0.33));

    // Dithering
    float dither = bayer4(cell) - 0.5;
    lum = clamp(lum + dither * DITHER_AMOUNT, 0.0, 1.0);

    // Char Map (8 levels)
    int charIdx = int(clamp((1.0 - lum) * 8.0, 0.0, 7.0));

    // Get Pixel of Char
    vec2 cellUV = fract(fragCoord / CELL_SIZE);
    float pixel = getCharPixel(charIdx, cellUV);

    // Colorize
    // Mix Background and Foreground
    vec3 finalCol = mix(u_color_bg, u_color_fg, pixel);

    // Vignette
    vec2 vuv = fragCoord / u_resolution.xy;
    float vig = 1.0 - length((vuv - 0.5) * 1.5);
    finalCol *= smoothstep(0.0, 1.0, vig);

    gl_FragColor = vec4(finalCol, 1.0);
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
    bg: [0.96, 0.97, 1.0], // Very Pale Blue
    fg: [0.2, 0.3, 0.6], // Medium Indigo
  },
  dark: {
    bg: [0.05, 0.08, 0.12], // Dark Navy/Charcoal
    fg: [0.4, 0.8, 0.95], // Cyan/Electric Blue
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      powerPreference: "high-performance",
      antialias: false,
      alpha: false, // Opaque is generally faster
      depth: false,
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
    const uFg = gl.getUniformLocation(program, "u_color_fg");
    const uIsDark = gl.getUniformLocation(program, "u_is_dark");

    let animationFrameId: number;
    let isRendering = false;
    const startTime = Date.now();

    // Draw function to be called by render loop and resize observer
    const drawScene = () => {
      const time = (Date.now() - startTime) / 1000;
      const colors = isDark ? THEME.dark : THEME.light;

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform3fv(uBg, colors.bg);
      gl.uniform3fv(uFg, colors.fg);
      gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // PERFORMANCE: ResizeObserver to handle sizing efficiently
    // Also capping DPR to max 1.5 to save GPU on high-DPI screens
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use devicePixelContentBoxSize if available for 1:1 pixel mapping, fallback to contentRect
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;

        const displayWidth = Math.round(width * dpr);
        const displayHeight = Math.round(height * dpr);

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
          gl.viewport(0, 0, displayWidth, displayHeight);
          // Fix: Draw immediately after resize to prevent flickering
          drawScene();
        }
      }
    });
    resizeObserver.observe(canvas);

    const render = () => {
      if (!isRendering) return;

      // Mouse easing
      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      drawScene();
      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRendering) {
        isRendering = true;
        render();
      }
    };

    const stopLoop = () => {
      isRendering = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };

    // PERFORMANCE: IntersectionObserver to pause when off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0.0 }, // Trigger as soon as 1 pixel is visible/invisible
    );
    intersectionObserver.observe(canvas);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
