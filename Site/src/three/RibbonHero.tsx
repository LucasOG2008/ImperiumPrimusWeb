import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
// Vetor FIEL da logo real (traçado de public/ip-mark.png com potrace).
import markup from "../assets/ip-mark-trace.svg?raw";

/* =============================================================================
   HERO 3D — a LOGO REAL da Imperium Primus, extrudada.
   O SVG é a vetorização fiel de ip-mark.png; cada subforma (losango, glifo
   esquerdo, glifo direito) vira uma peça com volume. As peças entram deslizando
   da própria direção e assentam na composição original — a silhueta permanece
   imediatamente reconhecível. Rim-light azul-frio como na logo.
   ============================================================================= */

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 30,
  bevelEnabled: true,
  bevelThickness: 3,
  bevelSize: 2,
  bevelSegments: 2,
  steps: 1,
};

type Piece = { geom: THREE.ExtrudeGeometry; dir: THREE.Vector3 };

function buildPieces(): { pieces: Piece[]; scale: number } {
  const data = new SVGLoader().parse(markup);
  const shapes: THREE.Shape[] = [];
  data.paths.forEach((p) => SVGLoader.createShapes(p).forEach((s) => shapes.push(s)));

  const raw = shapes.map((s) => new THREE.ExtrudeGeometry(s, EXTRUDE));

  // bbox combinada → centro e tamanho da logo inteira
  const box = new THREE.Box3();
  raw.forEach((g) => {
    g.computeBoundingBox();
    box.union(g.boundingBox!);
  });
  const center = new THREE.Vector3();
  box.getCenter(center);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = 2.15 / Math.max(size.x, size.y);

  const pieces = raw.map((g) => {
    g.computeBoundingBox();
    const c = new THREE.Vector3();
    g.boundingBox!.getCenter(c);
    const dir = c.clone().sub(center); // direção de saída/entrada da peça
    g.translate(-center.x, -center.y, -center.z); // centraliza no origin
    return { geom: g, dir };
  });

  return { pieces, scale };
}

function Logo({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const start = useRef<number | null>(null);
  const { pieces, scale } = useMemo(buildPieces, []);

  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;

    pieces.forEach((p, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const local = Math.min(Math.max((t - i * 0.16) / 1.15, 0), 1);
      const e = 1 - Math.pow(2, -10 * local); // out-expo
      // entra deslizando da própria direção (fora → posição final)
      m.position.set(p.dir.x * 1.9 * (1 - e), p.dir.y * 1.9 * (1 - e), 60 * (1 - e));
      (m.material as THREE.MeshStandardMaterial).opacity = local <= 0 ? 0 : Math.min(local * 1.6, 1);
    });

    const g = group.current;
    if (g) {
      // paralaxe sutil (mouse) — mantém a silhueta reconhecível
      g.rotation.y += (pointer.current.x * 0.32 - g.rotation.y) * 0.05;
      g.rotation.x += (-pointer.current.y * 0.22 - g.rotation.x) * 0.05;
      g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    }
  });

  // scale.y negativo: SVG tem eixo Y para baixo; invertendo, a logo fica de pé.
  // position x: desloca à direita para compor com o título (como a versão PNG).
  return (
    <group ref={group} position={[0.7, 0, 0]}>
      <group scale={[scale, -scale, scale]}>
        {pieces.map((p, i) => (
          <mesh key={i} ref={(m) => (meshes.current[i] = m)} geometry={p.geom}>
            <meshStandardMaterial
              color={"#eef1f4"}
              metalness={0.32}
              roughness={0.38}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              envMapIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function PointerCatcher({ onMove }: { onMove: (x: number, y: number) => void }) {
  return (
    <mesh position={[0, 0, 2]} onPointerMove={(e) => onMove(e.pointer.x, e.pointer.y)} visible={false}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial />
    </mesh>
  );
}

export default function RibbonHero() {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 32 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {/* chave neutra de cima */}
      <directionalLight position={[3, 5, 6]} intensity={2.2} color={"#ffffff"} />
      {/* rim-light azul-frio por trás — assinatura da logo */}
      <directionalLight position={[-4, -1, -6]} intensity={2.6} color={"#6fa8ff"} />
      <directionalLight position={[-6, 3, 2]} intensity={0.6} color={"#a9c8ff"} />
      <ambientLight intensity={0.28} />

      <PointerCatcher
        onMove={(x, y) => {
          pointer.current.x = x;
          pointer.current.y = y;
        }}
      />
      <Logo pointer={pointer} />
    </Canvas>
  );
}
