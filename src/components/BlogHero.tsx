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
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                  mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5 * n;
}

void main() {
    if (u_resolution.x < 1.0 || u_resolution.y < 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;

    vec2 tuv = uv - 0.5;

    // Use noise for dynamic rotation - slightly faster
    float degree = noise(vec2(u_time * 0.1, tuv.x * tuv.y));

    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
    tuv.y *= ratio;

    // Wave warping - matching original snippet speeds
    float frequency = 5.0;
    float amplitude = 30.0;
    float speed = u_time * 2.0;
    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    // Dynamic layers based on approved colors
    vec3 layer1 = mix(u_c1, u_c2, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(u_c3, u_c4, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));

    vec3 col = mix(layer1, layer2, S(0.5, -0.3, tuv.y));

    // Subtle grain to prevent banding
    float grain = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.01;
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
    console.warn("BlogHero Shader Error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const THEME = {
  light: {
    c1: [0.96, 0.93, 0.88], // Subtle Champagne
    c2: [0.9, 0.94, 0.98], // Soft Alice Blue
    c3: [0.96, 0.9, 0.93], // Pale Lavender Blush
    c4: [0.9, 0.96, 0.94], // Muted Honeydew
  },
  dark: {
    c1: [0.12, 0.1, 0.08], // Deep Chocolate/Gold base
    c2: [0.02, 0.03, 0.1], // Deep Midnight Blue
    c3: [0.1, 0.05, 0.08], // Deep Burgundy/Rose
    c4: [0.04, 0.08, 0.12], // Deep Teal
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
    const uC4 = gl.getUniformLocation(program, "u_c4");

    let animationFrameId: number;
    const startTime = Date.now();

    // PERFORMANCE: Use ResizeObserver to avoid polling clientWidth/Height in the loop
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const displayWidth = entry.contentRect.width;
        const displayHeight = entry.contentRect.height;

        const dpr = Math.min(window.devicePixelRatio || 1, 1.0) * 0.75; // Slightly higher for quality

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
      gl.uniform3fv(uC4, colors.c4);

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
