import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Environment, Float, MeshTransmissionMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* =============================================================
   GEOMETRY HELPERS
   ============================================================= */
function buildCricketGeometry() {
  const batShape = new THREE.Shape();
  batShape.moveTo(-0.15, -0.5);
  batShape.lineTo(0.15, -0.5);
  batShape.lineTo(0.18, 0.4);
  batShape.lineTo(-0.18, 0.4);
  batShape.closePath();
  const batGeo = new THREE.ExtrudeGeometry(batShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSize: 0.015,
    bevelThickness: 0.015,
    bevelSegments: 4,
  });
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 32);
  return { batGeo, handleGeo };
}

function buildDumbbellGroup() {
  const barGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 32);
  barGeo.rotateZ(Math.PI / 2);
  const plateGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.18, 64);
  plateGeo.rotateZ(Math.PI / 2);
  return { barGeo, plateGeo };
}

function buildTrophyShape() {
  const cup = new THREE.Shape();
  cup.moveTo(-0.22, 0.35);
  cup.lineTo(0.22, 0.35);
  cup.lineTo(0.18, -0.05);
  cup.quadraticCurveTo(0, -0.15, -0.18, -0.05);
  cup.closePath();
  return cup;
}

/* =============================================================
   PREMIUM MATERIALS
   ============================================================= */
const GoldMaterial = () => (
  <MeshDistortMaterial
    color="#fadb5f"
    metalness={1}
    roughness={0.1}
    distort={0.2}
    speed={2}
    emissive="#4a3810"
    emissiveIntensity={0.2}
  />
);

const GlassMaterial = ({ opacity = 1 }) => (
  <MeshTransmissionMaterial
    backside
    samples={2}
    thickness={0.4}
    chromaticAberration={0.03}
    anisotropy={0.05}
    distortion={0.08}
    distortionScale={0.2}
    temporalDistortion={0.05}
    color="#e0c58a"
    transmission={0.88}
    opacity={opacity}
    transparent
  />
);

/* =============================================================
   DISCIPLINE ICON
   ============================================================= */
function DisciplineIcon({ type, scrollProgress, cornerPosition, index, totalCount, mouseX, mouseY }) {
  const groupRef = useRef();
  const innerRef = useRef();
  
  const cricketGeos = useMemo(() => (type === 'sport' ? buildCricketGeometry() : null), [type]);
  const dumbbellGeos = useMemo(() => (type === 'fitness' ? buildDumbbellGroup() : null), [type]);
  const trophyShape = useMemo(() => (type === 'awards' ? buildTrophyShape() : null), [type]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current || 0;
    const mx = mouseX.current || 0;
    const my = mouseY.current || 0;

    const mountDelay = 1.2 + index * 0.15;
    const mountProgress = Math.max(0, Math.min(1, (t - mountDelay) / 0.9));
    const easedMount = 1 - Math.pow(1 - mountProgress, 4);
    const flyOutPhase = THREE.MathUtils.smoothstep(sp, 0.35, 0.85);

    const angle = (index / totalCount) * Math.PI * 2 + t * 0.18;
    const radius = 2.6 + Math.sin(t * 0.5 + index) * 0.08;
    const orbitX = Math.cos(angle) * radius;
    const orbitY = Math.sin(angle) * radius * 0.55 + Math.sin(t * 0.7 + index * 1.3) * 0.15;
    const orbitZ = Math.sin(angle) * 0.6;

    const mountX = orbitX * easedMount;
    const mountY = orbitY * easedMount;
    const mountZ = THREE.MathUtils.lerp(-5, orbitZ, easedMount);

    const cx = cornerPosition[0];
    const cy = cornerPosition[1];
    const cz = cornerPosition[2];
    groupRef.current.position.x = THREE.MathUtils.lerp(mountX, cx, flyOutPhase) + mx * 0.15;
    groupRef.current.position.y = THREE.MathUtils.lerp(mountY, cy, flyOutPhase) + my * 0.1;
    groupRef.current.position.z = THREE.MathUtils.lerp(mountZ, cz, flyOutPhase);

    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.6 + index;
      innerRef.current.rotation.x = Math.sin(t * 0.4 + index) * 0.15;
      const cornerScale = 1 + flyOutPhase * 0.15;
      innerRef.current.scale.setScalar(cornerScale * easedMount);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <group ref={innerRef}>
          {/* Glowing Aura Ring */}
          <mesh position={[0, 0, -0.1]}>
            <torusGeometry args={[0.55, 0.02, 16, 64]} />
            <meshBasicMaterial color="#ffdc73" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>

          {/* Icon Content */}
          {type === 'sport' && (
            <group rotation={[0, 0, -0.4]}>
              <mesh geometry={cricketGeos.batGeo} position={[0.05, 0.05, 0]}>
                <GoldMaterial />
              </mesh>
              <mesh geometry={cricketGeos.handleGeo} position={[0.05, 0.32, 0]}>
                <meshStandardMaterial color="#333" roughness={0.8} />
              </mesh>
              <mesh position={[-0.15, -0.18, 0.08]}>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial color="#ff4040" roughness={0.4} metalness={0.1} />
              </mesh>
            </group>
          )}

          {type === 'music' && (
            <group>
              <mesh position={[0, -0.12, 0]} rotation={[0, 0, -0.25]}>
                <sphereGeometry args={[0.16, 32, 32]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0.15, 0.1, 0]}>
                <boxGeometry args={[0.04, 0.5, 0.04]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0.22, 0.28, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.18, 0.08, 0.02]} />
                <GoldMaterial />
              </mesh>
            </group>
          )}

          {type === 'fitness' && (
            <group>
              <mesh geometry={dumbbellGeos.barGeo}>
                <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh geometry={dumbbellGeos.plateGeo} position={[-0.3, 0, 0]}>
                <GoldMaterial />
              </mesh>
              <mesh geometry={dumbbellGeos.plateGeo} position={[0.3, 0, 0]}>
                <GoldMaterial />
              </mesh>
            </group>
          )}

          {type === 'awards' && (
            <group>
              <mesh>
                <extrudeGeometry args={[trophyShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 4 }]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0, -0.18, 0.05]}>
                <boxGeometry args={[0.05, 0.12, 0.05]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0, -0.3, 0.05]}>
                <boxGeometry args={[0.3, 0.06, 0.1]} />
                <meshStandardMaterial color="#111" roughness={0.8} />
              </mesh>
            </group>
          )}

          {/* Glass encasement */}
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <GlassMaterial />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

/* =============================================================
   THE SHIELD (Super Premium Glass/Gold)
   ============================================================= */
function Shield({ mouseX, mouseY, scrollProgress }) {
  const ref = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (!ref.current || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const mx = mouseX.current || 0;
    const my = mouseY.current || 0;
    const sp = scrollProgress.current || 0;

    const mountProgress = Math.min(1, t / 1.4);
    const easedMount = 1 - Math.pow(1 - mountProgress, 4);

    const targetRotX = -my * 0.25 + Math.sin(t * 0.4) * 0.03;
    const targetRotY = mx * 0.35 + Math.cos(t * 0.3) * 0.05;
    ref.current.rotation.x += (targetRotX - ref.current.rotation.x) * 0.06;
    ref.current.rotation.y += (targetRotY - ref.current.rotation.y) * 0.06;
    ref.current.position.y = Math.sin(t * 0.6) * 0.08;

    const mountScale = THREE.MathUtils.lerp(0.05, 1, easedMount);
    const scrollScale = 1 + sp * 0.4;
    groupRef.current.scale.setScalar(mountScale * scrollScale);
    groupRef.current.position.z = THREE.MathUtils.lerp(-3, sp * 1.2, easedMount);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={ref}>
          {/* Glass shield body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2, 2, 0.2, 64]} />
            <GlassMaterial opacity={0.6} />
          </mesh>
          
          {/* Inner Gold Core */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <GoldMaterial />
          </mesh>

          {/* MDF Logo Text 3D Approximation */}
          <mesh position={[0, 0, 0.3]}>
            <boxGeometry args={[1.8, 0.5, 0.1]} />
            <GoldMaterial />
          </mesh>
        </group>
      </Float>
      
      {/* Background ambient glow */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#c9a96e" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* =============================================================
   ORBITING RINGS
   ============================================================= */
function OrbitRings({ scrollProgress }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current || 0;
    const mountProgress = Math.min(1, t / 1.6);

    if (ring1.current) {
      ring1.current.rotation.z = t * 0.1;
      ring1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
      ring1.current.material.opacity = (1 - sp * 1.2) * 0.6 * mountProgress;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.07;
      ring2.current.rotation.y = Math.cos(t * 0.15) * 0.2;
      ring2.current.material.opacity = (1 - sp * 1.5) * 0.4 * mountProgress;
    }
    if (ring3.current) {
      ring3.current.rotation.z = t * 0.05;
      ring3.current.material.opacity = (1 - sp * 1.5) * 0.2 * mountProgress;
    }
  });

  return (
    <group>
      <mesh ref={ring1}>
        <torusGeometry args={[3.2, 0.01, 16, 200]} />
        <meshStandardMaterial color="#fadb5f" transparent opacity={0} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[4.0, 0.015, 16, 200]} />
        <meshStandardMaterial color="#ffc233" transparent opacity={0} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[4.8, 0.005, 16, 200]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* =============================================================
   MAIN SCENE
   ============================================================= */
function Scene({ mouseX, mouseY, scrollProgress }) {
  const disciplines = [
    { type: 'sport', cornerPosition: [-4, 2, 0] },
    { type: 'music', cornerPosition: [4, 2, 0] },
    { type: 'fitness', cornerPosition: [-4, -2, 0] },
    { type: 'awards', cornerPosition: [4, -2, 0] },
  ];

  useFrame((state) => {
    const sp = scrollProgress.current || 0;
    const mx = mouseX.current || 0;
    const my = mouseY.current || 0;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mx * 0.5, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, my * 0.4, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6.5 - sp * 1.5, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Environment preset="warehouse" />
      <ambientLight intensity={0.2} />
      
      <Suspense fallback={null}>
        <OrbitRings scrollProgress={scrollProgress} />
        <Shield mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />

        {disciplines.map((d, i) => (
          <DisciplineIcon
            key={d.type}
            type={d.type}
            scrollProgress={scrollProgress}
            cornerPosition={d.cornerPosition}
            index={i}
            totalCount={disciplines.length}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}

        <Sparkles count={60} size={4} scale={[12, 8, 6]} speed={0.3} color="#ffdc73" opacity={0.5} />
      </Suspense>
    </>
  );
}

/* =============================================================
   EXPORT
   ============================================================= */
export default function HeroScene({ mouseX, mouseY, scrollProgress }) {
  return (
    <div className="hero-3d-container absolute inset-0 overflow-hidden">
      <Suspense fallback={<div className="w-full h-full bg-[#050e1c]" />}>
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.5], fov: 45 }}
          style={{ background: 'transparent' }}
          performance={{ min: 0.5 }}
        >
          <Scene mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>

      {/* Atmospheric Vignette Overlay */}
      <div className="vignette-layer absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}

