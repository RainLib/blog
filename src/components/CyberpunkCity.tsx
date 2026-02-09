import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Text,
  PerspectiveCamera,
  Stars,
  Instance,
  Instances,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";

// --- Components ---

function MovingGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (gridRef.current) {
      // Move grid towards camera to simulate speed
      gridRef.current.position.z = (state.clock.getElapsedTime() * 10) % 10;
    }
  });

  return (
    <group>
      <gridHelper
        ref={gridRef}
        args={[200, 50, 0xff00ff, 0x00f2fe]} // Pink center, Cyan grid
        position={[0, -2, 0]}
      />
      {/* Second grid for detail */}
      <gridHelper
        args={[200, 10, 0x000000, 0x000000]}
        position={[0, -2.1, 0]}
      />
    </group>
  );
}

function NeonBuildings({ count = 100 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random building positions
  const buildings = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = -Math.random() * 100 - 10; // Only ahead
      const h = Math.random() * 5 + 2;
      // Avoid center path
      if (Math.abs(x) < 5) continue;
      temp.push({ x, z, h });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    buildings.forEach((data, i) => {
      // Move buildings towards camera
      let z = data.z + state.clock.getElapsedTime() * 10;
      // Reset if passed camera
      if (z > 10) z -= 110;

      dummy.position.set(data.x, -2 + data.h / 2, z);
      dummy.scale.set(1, data.h, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, buildings.length]}
    >
      <boxGeometry args={[2, 1, 2]} />
      {/* Neon/Wireframe Look via standard material + Bloom */}
      <meshStandardMaterial
        color="#000000"
        emissive="#00f2fe"
        emissiveIntensity={0.5}
        wireframe={false}
      />
    </instancedMesh>
  );
}

function FloatingText() {
  return (
    <group>
      <Text
        position={[0, 1, -5]}
        fontSize={1.5}
        color="#00f2fe"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0Pn5.woff"
      >
        RAINLIB
      </Text>
      <Text
        position={[0, 0, -5]}
        fontSize={0.5}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0Pn5.woff"
      >
        SYSTEM ONLINE
      </Text>
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 0, 60]} />

      <MovingGrid />
      <NeonBuildings count={200} />
      <FloatingText />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Post Processing for the GLOW */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
          intensity={1.5}
        />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
    </>
  );
}

export default function CyberpunkCity() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        gl={{ antialias: false }} // Optimization
      >
        <Scene />
      </Canvas>
    </div>
  );
}
