"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 160;

function createPoints(color: number, spreadX: number, spreadY: number): {
  points: THREE.Points;
  speeds: Float32Array;
} {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const speeds = new Float32Array(PARTICLE_COUNT);
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    positions[index * 3] = (Math.random() - 0.4) * spreadX;
    positions[index * 3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 4;
    speeds[index] = 0.35 + Math.random() * 0.9;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size: 3.2,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  return { points: new THREE.Points(geometry, material), speeds };
}

function createSwoosh(color: number, lift: number): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7, -0.4 + lift, -1),
    new THREE.Vector3(-3, 1.6 + lift, 0),
    new THREE.Vector3(0.5, 0.2 + lift, -0.4),
    new THREE.Vector3(4, 1.4 + lift, 0.2),
    new THREE.Vector3(7.5, 0.3 + lift, -0.6),
  ]);
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 80, 0.035, 8, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, depthWrite: false })
  );
}

/** Soft drifting points and flight-like curves behind the homepage hero. */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) {
      return undefined;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.z = 9;
    const nearField = createPoints(0x1e88e5, 18, 10);
    const farField = createPoints(0x90caf9, 20, 12);
    const upperSwoosh = createSwoosh(0x29b6f6, 0.2);
    const lowerSwoosh = createSwoosh(0x1565c0, -1.4);
    scene.add(farField.points, nearField.points, upperSwoosh, lowerSwoosh);
    const resize = (): void => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    let frameId = 0;
    const animate = (timeMs: number): void => {
      const time = timeMs * 0.001;
      if (!reducedMotion) {
        const fields = [nearField, farField];
        fields.forEach((field, fieldIndex) => {
          const position = field.points.geometry.getAttribute("position") as THREE.BufferAttribute;
          for (let index = 0; index < PARTICLE_COUNT; index += 1) {
            let x = position.getX(index) + field.speeds[index] * 0.008 * (fieldIndex === 0 ? 1 : 0.6);
            if (x > 9) {
              x = -9;
            }
            position.setX(index, x);
            position.setY(index, position.getY(index) + Math.sin(time * 0.6 + index) * 0.002);
          }
          position.needsUpdate = true;
        });
        upperSwoosh.position.y = Math.sin(time * 0.35) * 0.18;
        lowerSwoosh.position.y = Math.cos(time * 0.28) * 0.14;
      }
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      nearField.points.geometry.dispose();
      (nearField.points.material as THREE.Material).dispose();
      farField.points.geometry.dispose();
      (farField.points.material as THREE.Material).dispose();
      upperSwoosh.geometry.dispose();
      (upperSwoosh.material as THREE.Material).dispose();
      lowerSwoosh.geometry.dispose();
      (lowerSwoosh.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
