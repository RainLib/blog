import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Float,
  Stars,
  Environment,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

function GlassShape() {
  const mesh = useRef(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={mesh} scale={2.5}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2}
            chromaticAberration={0.5}
            anisotropy={0.5}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.2}
            ior={1.2}
            color="#ffffff"
            background={new THREE.Color("#050505")}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Particles({ count = 100 }) {
  const points = useRef(null);

  // simple static particles for depth
  const coords = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) coords[i] = (Math.random() - 0.5) * 20;

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={coords}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00f2fe"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <GlassShape />
      <Particles count={300} />

      {/* Environment for reflections is crucial for glass */}
      <Environment preset="city" />

      <directionalLight position={[5, 5, 5]} intensity={2} color="#00f2fe" />
      <directionalLight position={[-5, -5, -5]} intensity={2} color="#ff00ff" />
      <ambientLight intensity={0.5} />
    </>
  );
}

export default function LiquidGlass() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
