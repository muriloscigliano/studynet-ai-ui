import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Bayer matrix texture (8x8)
    const bayerMatrix = new Uint8Array([
      0, 32, 8, 40, 2, 34, 10, 42,
      48, 16, 56, 24, 50, 18, 58, 26,
      12, 44, 4, 36, 14, 46, 6, 38,
      60, 28, 52, 20, 62, 30, 54, 22,
      3, 35, 11, 43, 1, 33, 9, 41,
      51, 19, 59, 27, 49, 17, 57, 25,
      15, 47, 7, 39, 13, 45, 5, 37,
      63, 31, 55, 23, 61, 29, 53, 21
    ]);

    const bayerTexture = new THREE.DataTexture(
      bayerMatrix,
      8,
      8,
      THREE.RedFormat,
      THREE.UnsignedByteType
    );
    bayerTexture.magFilter = THREE.NearestFilter;
    bayerTexture.minFilter = THREE.NearestFilter;
    bayerTexture.wrapS = THREE.RepeatWrapping;
    bayerTexture.wrapT = THREE.RepeatWrapping;
    bayerTexture.needsUpdate = true;

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        bayerTexture: { value: bayerTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform sampler2D bayerTexture;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          vec2 pixelCoord = gl_FragCoord.xy;
          
          // Animated wave pattern
          float wave1 = sin(uv.x * 3.0 + time * 0.5) * 0.5 + 0.5;
          float wave2 = cos(uv.y * 4.0 - time * 0.3) * 0.5 + 0.5;
          float wave3 = sin(length(uv - 0.5) * 8.0 + time * 0.4) * 0.5 + 0.5;
          
          float pattern = (wave1 + wave2 + wave3) / 3.0;
          
          // Sample Bayer matrix
          vec2 bayerUV = pixelCoord / 8.0;
          float bayerValue = texture2D(bayerTexture, bayerUV).r / 255.0;
          
          // Apply dithering
          float threshold = pattern;
          float dithered = step(bayerValue, threshold);
          
          // Theme colors
          vec3 color1 = vec3(0.067, 0.075, 0.129); // Dark background #111321
          vec3 color2 = vec3(0.608, 0.125, 0.392); // Primary pink #9B2064
          vec3 color3 = vec3(0.698, 0.290, 0.514); // Primary border #B24A83
          
          // Mix colors with dithering
          vec3 baseColor = mix(color1, color2, pattern * 0.4);
          vec3 finalColor = mix(baseColor, color3, dithered * 0.2);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    console.log('Three.js Bayer dithering initialized');

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      bayerTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
