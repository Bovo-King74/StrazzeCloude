import * as THREE from 'three';

/**
 * Active Theory-inspired atmospheric background shader.
 * Renders an expansive, dark sci-fi volumetric sky dome with subtle light pillars
 * and procedural star/dust particles computed entirely on the GPU.
 */
export const AtmosphericShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#030308') },
    uColorB: { value: new THREE.Color('#0d111d') },
    uAccent: { value: new THREE.Color('#00f0ff') }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uAccent;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    // Simple pseudo-noise function
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      // Vertical gradient from deep cosmic void to floor horizon
      float gradient = smoothstep(-15.0, 30.0, vWorldPosition.y);
      vec3 base = mix(uColorA, uColorB, gradient);

      // Subtle atmospheric sci-fi energy pillars
      float pillar1 = sin(vWorldPosition.x * 0.08 + uTime * 0.4) * cos(vWorldPosition.z * 0.08 + uTime * 0.3);
      pillar1 = smoothstep(0.7, 1.0, pillar1) * 0.12;

      // Subtle dynamic dust noise
      float dust = hash(vUv * 450.0 + sin(uTime * 0.1));
      dust = step(0.994, dust) * 0.18;

      vec3 finalColor = base + uAccent * pillar1 + vec3(dust);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

