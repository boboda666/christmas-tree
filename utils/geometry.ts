import * as THREE from 'three';
import { ParticleData, MorphConfig } from '../types';

// Helper to calculate positions on a cone surface using Golden Spiral
const calculateConePosition = (index: number, total: number, radiusBase: number, height: number): THREE.Vector3 => {
  const y = (index / total) * height; // Height from 0 to max
  const radiusAtY = radiusBase * (1 - (index / total)); // Tapering radius
  const angle = index * 2.39996; // Golden angle in radians

  const x = Math.cos(angle) * radiusAtY;
  const z = Math.sin(angle) * radiusAtY;

  return new THREE.Vector3(x, y - height / 2, z);
};

// Helper for random point inside a sphere
const calculateSpherePosition = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

export const generateParticles = (config: MorphConfig): ParticleData[] => {
  const particles: ParticleData[] = [];
  const { count, baseRadius, height, scatterRadius, colorPalette } = config;

  for (let i = 0; i < count; i++) {
    // 1. Tree Position (Ordered spiral)
    const treePos = calculateConePosition(i, count, baseRadius, height);
    
    // Add some jitter to tree pos so it's not perfectly artificial
    treePos.x += (Math.random() - 0.5) * 0.2;
    treePos.z += (Math.random() - 0.5) * 0.2;
    treePos.y += (Math.random() - 0.5) * 0.2;

    // 2. Scatter Position (Random sphere)
    const scatterPos = calculateSpherePosition(scatterRadius);

    // 3. Visual Attributes
    const colorHex = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    const color = new THREE.Color(colorHex);
    
    // Random rotation
    const rotation = new THREE.Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    particles.push({
      id: i,
      scatterPosition: scatterPos,
      treePosition: treePos,
      rotation,
      scale: 0.5 + Math.random() * 0.8, // Random size
      color,
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  return particles;
};