import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroScene3DProps {
  className?: string;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 28;

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1c29, 2.5);
    scene.add(ambientLight);

    // Studio brand orange rim light
    const orangeLight = new THREE.PointLight(0xff5722, 5, 50);
    orangeLight.position.set(12, 10, 8);
    scene.add(orangeLight);

    // Cosmic teal fill light
    const tealLight = new THREE.PointLight(0x22d3ee, 4, 60);
    tealLight.position.set(-15, -8, 10);
    scene.add(tealLight);

    // Deep purple secondary ambient light
    const purpleLight = new THREE.PointLight(0x8b5cf6, 2, 40);
    purpleLight.position.set(0, 15, -5);
    scene.add(purpleLight);

    // Group for game-world floating relics
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Crystalline Icosahedron Relic
    const icoGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x1f2438,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
      flatShading: true,
      emissive: 0x090b12,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(11, 2, -4);
    worldGroup.add(icosahedron);

    // Wireframe cage around icosahedron
    const wireGeo = new THREE.IcosahedronGeometry(2.9, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff5722,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireCage = new THREE.Mesh(wireGeo, wireMat);
    wireCage.position.copy(icosahedron.position);
    worldGroup.add(wireCage);

    // 2. Floating Octahedron Core (Left-bottom)
    const octaGeo = new THREE.OctahedronGeometry(1.8, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0x161822,
      roughness: 0.3,
      metalness: 0.9,
      flatShading: true,
      emissive: 0x052e3d,
    });
    const octahedron = new THREE.Mesh(octaGeo, octaMat);
    octahedron.position.set(-12, -4, -2);
    worldGroup.add(octahedron);

    // Octahedron ring
    const ringGeo = new THREE.TorusGeometry(3.2, 0.05, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.45,
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.position.copy(octahedron.position);
    orbitalRing.rotation.x = Math.PI / 3;
    worldGroup.add(orbitalRing);

    // 3. Small celestial drifting particles / shards
    const shardCount = 45;
    const shardGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(0.3, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.8,
      flatShading: true,
    });

    const shards: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number; z: number }; originY: number; speed: number }[] = [];

    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 18 - 4;
      shard.position.set(x, y, z);
      const scale = 0.4 + Math.random() * 0.9;
      shard.scale.set(scale, scale, scale);

      shardGroup.add(shard);
      shards.push({
        mesh: shard,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        originY: y,
        speed: 0.005 + Math.random() * 0.008,
      });
    }
    worldGroup.add(shardGroup);

    // 4. Starlight Starfield Particles
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xff8a65), // orange warm starlight
      new THREE.Color(0x38bdf8), // cyan starlight
      new THREE.Color(0x94a3b8), // soft slate
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 60;
      starPositions[idx + 1] = (Math.random() - 0.5) * 45;
      starPositions[idx + 2] = (Math.random() - 0.5) * 35 - 5;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[idx] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Mouse Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Responsive Resize handling
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera parallax damping
      targetCameraX = mouseX * 2.5;
      targetCameraY = mouseY * 2.0;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Rotate primary relics
      icosahedron.rotation.x += 0.005;
      icosahedron.rotation.y += 0.008;
      wireCage.rotation.x -= 0.004;
      wireCage.rotation.y += 0.006;
      wireCage.position.y = icosahedron.position.y = 2 + Math.sin(elapsedTime * 0.8) * 0.4;

      octahedron.rotation.x += 0.007;
      octahedron.rotation.z += 0.005;
      orbitalRing.rotation.z += 0.012;
      orbitalRing.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.2;
      orbitalRing.position.y = octahedron.position.y = -4 + Math.cos(elapsedTime * 0.7) * 0.5;

      // Animate drifting shards
      for (let i = 0; i < shards.length; i++) {
        const shard = shards[i];
        shard.mesh.rotation.x += shard.rotSpeed.x;
        shard.mesh.rotation.y += shard.rotSpeed.y;
        shard.mesh.rotation.z += shard.rotSpeed.z;
        shard.mesh.position.y = shard.originY + Math.sin(elapsedTime * 0.5 + i) * 0.35;
      }

      // Starfield slow cosmic drift
      starField.rotation.y = elapsedTime * 0.015;
      starField.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      octaGeo.dispose();
      octaMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
