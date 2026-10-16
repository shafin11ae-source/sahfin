import React, { useEffect, useRef, useState, useId } from 'react';
import * as THREE from 'three';
import { useMotion } from '../context/MotionContext';
import { Sun, RotateCw, Sparkles, Sliders, Play, Pause, Compass } from 'lucide-react';

type MaterialFinish = 'titanium' | 'obsidian' | 'gold';
type LightingPreset = 'cursor' | 'studio' | 'rim';

export const InteractiveEmblem3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, playFeedbackSound } = useMotion();

  // Interactive HUD state
  const [materialFinish, setMaterialFinish] = useState<MaterialFinish>('titanium');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('cursor');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // References to keep updated in the animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const emblemGroupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotationOffsetRef = useRef({ x: 0.1, y: -0.3 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight = new THREE.DirectionalLight(0xa5f3fc, 1.8);
    rimLight.position.set(-5, -4, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const fillLight = new THREE.DirectionalLight(0xf8fafc, 0.9);
    fillLight.position.set(0, -4, 4);
    scene.add(fillLight);

    // 5. Construct Architectural DF Monogram in 3D
    const emblemGroup = new THREE.Group();
    emblemGroupRef.current = emblemGroup;
    scene.add(emblemGroup);

    // Create 2D Shape for the "D" and "F" geometric interlocking extrusion
    const shape = new THREE.Shape();
    // Start at bottom left of D
    shape.moveTo(-1.8, -1.8);
    // Up to top left
    shape.lineTo(-1.8, 1.8);
    // Across top bar of F
    shape.lineTo(1.8, 1.8);
    shape.lineTo(1.8, 1.1);
    shape.lineTo(0.3, 1.1);
    shape.lineTo(0.3, 0.4);
    // Mid horizontal bar of F
    shape.lineTo(1.5, 0.4);
    shape.lineTo(1.5, -0.3);
    shape.lineTo(0.3, -0.3);
    shape.lineTo(0.3, -1.8);
    shape.lineTo(-1.8, -1.8);

    // Create inner negative space hole for the 'D'
    const hole = new THREE.Path();
    hole.moveTo(-1.1, -1.1);
    hole.lineTo(-1.1, 1.1);
    hole.lineTo(-0.2, 1.1);
    hole.lineTo(-0.2, -1.1);
    hole.lineTo(-1.1, -1.1);
    shape.holes.push(hole);

    // Extrude with precision beveled architectural edges
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // Material setup
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.22,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    emblemGroup.add(mesh);

    // Add surrounding precision coordinate frame ring
    const frameGeometry = new THREE.RingGeometry(2.8, 2.84, 64);
    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    emblemGroup.add(frameMesh);

    // Center focal point indicator
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.set(0, 0, 0.4);
    emblemGroup.add(nodeMesh);

    // 6. Handle Resizing
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Mouse and Pointer tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mousePosRef.current.targetX = (clientX / rect.width - 0.5) * 2;
      mousePosRef.current.targetY = -(clientY / rect.height - 0.5) * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 8. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth pointer interpolation
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.08;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.08;

      if (emblemGroupRef.current) {
        if (autoRotate && !isDragging && !settings.reducedMotion) {
          rotationOffsetRef.current.y += delta * 0.6;
        }

        // Apply rotation with gentle tilt from mouse
        const tiltX = settings.reducedMotion ? 0 : mousePosRef.current.y * 0.35;
        const tiltY = settings.reducedMotion ? 0 : mousePosRef.current.x * 0.35;

        emblemGroupRef.current.rotation.x = rotationOffsetRef.current.x + tiltX;
        emblemGroupRef.current.rotation.y = rotationOffsetRef.current.y + tiltY;
      }

      // Update Key Light Position if in cursor mode
      if (keyLightRef.current && lightingPreset === 'cursor') {
        keyLightRef.current.position.x = mousePosRef.current.x * 6 + 2;
        keyLightRef.current.position.y = mousePosRef.current.y * 6 + 3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      // Dispose geometries and materials
      geometry.dispose();
      material.dispose();
      frameGeometry.dispose();
      frameMaterial.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update materials when user changes finish
  useEffect(() => {
    if (!emblemGroupRef.current) return;
    const mesh = emblemGroupRef.current.children[0] as THREE.Mesh;
    if (!mesh || !mesh.material) return;

    const mat = mesh.material as THREE.MeshStandardMaterial;

    if (materialFinish === 'obsidian') {
      mat.color.setHex(0x18181b);
      mat.metalness = 0.98;
      mat.roughness = 0.12;
    } else if (materialFinish === 'titanium') {
      mat.color.setHex(0xd4d4d8);
      mat.metalness = 0.9;
      mat.roughness = 0.24;
    } else if (materialFinish === 'gold') {
      mat.color.setHex(0xd4af37);
      mat.metalness = 0.88;
      mat.roughness = 0.18;
    }
  }, [materialFinish]);

  // Update lighting preset
  useEffect(() => {
    if (!keyLightRef.current || !rimLightRef.current) return;

    if (lightingPreset === 'studio') {
      keyLightRef.current.position.set(4, 5, 5);
      keyLightRef.current.intensity = 2.6;
      rimLightRef.current.intensity = 1.2;
    } else if (lightingPreset === 'rim') {
      keyLightRef.current.position.set(1, 1, 3);
      keyLightRef.current.intensity = 1.0;
      rimLightRef.current.position.set(-6, -4, -3);
      rimLightRef.current.intensity = 3.4;
    } else {
      // Cursor tracking default
      keyLightRef.current.intensity = 2.4;
      rimLightRef.current.intensity = 1.6;
    }
  }, [lightingPreset]);

  // Pointer drag controls for manual 3D rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.008;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.008;

    rotationOffsetRef.current.y += deltaX;
    rotationOffsetRef.current.x += deltaY;

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full h-full min-h-[420px] lg:min-h-[500px] rounded-2xl overflow-hidden border flex flex-col justify-between group select-none shadow-2xl"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Atmospheric ambient backlight glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--accent-focal, #10b981) 0%, transparent 65%)',
        }}
      />

      {/* Top Header Overlay: Atelier Coordinates */}
      <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md text-[11px] font-mono tracking-widest text-[var(--text-main)]"
             style={{ backgroundColor: 'rgba(var(--bg-surface-elevated), 0.8)', borderColor: 'var(--border-subtle)' }}>
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>PRECISION 3D MONOGRAM</span>
        </div>

        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] hidden sm:block">
          Interactive Drag & Tilt
        </div>
      </div>

      {/* Bottom Control HUD (Tactile Swiss Controls) */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t backdrop-blur-md"
           style={{ backgroundColor: 'rgba(var(--bg-surface), 0.85)', borderColor: 'var(--border-subtle)' }}>
        
        {/* Material Finish Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] pr-1">
            Finish:
          </span>
          {(['titanium', 'obsidian', 'gold'] as MaterialFinish[]).map(finish => (
            <button
              key={finish}
              onClick={() => {
                playFeedbackSound('click');
                setMaterialFinish(finish);
              }}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                materialFinish === finish
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-white'
              }`}
            >
              {finish === 'titanium' ? 'Titanium' : finish === 'obsidian' ? 'Obsidian' : 'Gold'}
            </button>
          ))}
        </div>

        {/* Lighting & Rotation Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Lighting Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] pr-1">
              Light:
            </span>
            {(['cursor', 'studio', 'rim'] as LightingPreset[]).map(preset => (
              <button
                key={preset}
                onClick={() => {
                  playFeedbackSound('toggle');
                  setLightingPreset(preset);
                }}
                className={`px-2 py-1 text-[10px] font-mono uppercase rounded border transition-colors cursor-pointer ${
                  lightingPreset === preset
                    ? 'border-white/40 text-[var(--text-main)] bg-white/10'
                    : 'border-transparent text-[var(--text-muted)] hover:text-white'
                }`}
                title={`Switch light to ${preset}`}
              >
                {preset === 'cursor' ? 'Cursor' : preset === 'studio' ? '45° Key' : 'Rim'}
              </button>
            ))}
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => {
              playFeedbackSound('toggle');
              setAutoRotate(!autoRotate);
            }}
            className="p-1.5 rounded-md border hover:border-white/40 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
            title={autoRotate ? 'Pause Rotation' : 'Resume Auto-Rotation'}
            aria-label="Toggle auto rotation"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
