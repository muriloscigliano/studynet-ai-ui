import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    console.log('WebGL initialized successfully');

    let animationId: number;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with Bayer dithering
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      // Bayer matrix 8x8
      float bayer8(vec2 pos) {
        int x = int(mod(pos.x, 8.0));
        int y = int(mod(pos.y, 8.0));
        int index = x + y * 8;
        
        float bayerMatrix[64];
        bayerMatrix[0] = 0.0; bayerMatrix[1] = 32.0; bayerMatrix[2] = 8.0; bayerMatrix[3] = 40.0;
        bayerMatrix[4] = 2.0; bayerMatrix[5] = 34.0; bayerMatrix[6] = 10.0; bayerMatrix[7] = 42.0;
        bayerMatrix[8] = 48.0; bayerMatrix[9] = 16.0; bayerMatrix[10] = 56.0; bayerMatrix[11] = 24.0;
        bayerMatrix[12] = 50.0; bayerMatrix[13] = 18.0; bayerMatrix[14] = 58.0; bayerMatrix[15] = 26.0;
        bayerMatrix[16] = 12.0; bayerMatrix[17] = 44.0; bayerMatrix[18] = 4.0; bayerMatrix[19] = 36.0;
        bayerMatrix[20] = 14.0; bayerMatrix[21] = 46.0; bayerMatrix[22] = 6.0; bayerMatrix[23] = 38.0;
        bayerMatrix[24] = 60.0; bayerMatrix[25] = 28.0; bayerMatrix[26] = 52.0; bayerMatrix[27] = 20.0;
        bayerMatrix[28] = 62.0; bayerMatrix[29] = 30.0; bayerMatrix[30] = 54.0; bayerMatrix[31] = 22.0;
        bayerMatrix[32] = 3.0; bayerMatrix[33] = 35.0; bayerMatrix[34] = 11.0; bayerMatrix[35] = 43.0;
        bayerMatrix[36] = 1.0; bayerMatrix[37] = 33.0; bayerMatrix[38] = 9.0; bayerMatrix[39] = 41.0;
        bayerMatrix[40] = 51.0; bayerMatrix[41] = 19.0; bayerMatrix[42] = 59.0; bayerMatrix[43] = 27.0;
        bayerMatrix[44] = 49.0; bayerMatrix[45] = 17.0; bayerMatrix[46] = 57.0; bayerMatrix[47] = 25.0;
        bayerMatrix[48] = 15.0; bayerMatrix[49] = 47.0; bayerMatrix[50] = 7.0; bayerMatrix[51] = 39.0;
        bayerMatrix[52] = 13.0; bayerMatrix[53] = 45.0; bayerMatrix[54] = 5.0; bayerMatrix[55] = 37.0;
        bayerMatrix[56] = 63.0; bayerMatrix[57] = 31.0; bayerMatrix[58] = 55.0; bayerMatrix[59] = 23.0;
        bayerMatrix[60] = 61.0; bayerMatrix[61] = 29.0; bayerMatrix[62] = 53.0; bayerMatrix[63] = 21.0;
        
        return bayerMatrix[index] / 64.0;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 pos = gl_FragCoord.xy;
        
        // Animated waves
        float wave1 = sin(uv.x * 2.0 + time * 0.6) * 0.5 + 0.5;
        float wave2 = cos(uv.y * 2.5 + time * 0.4) * 0.5 + 0.5;
        float wave3 = sin(length(uv - 0.5) * 5.0 - time * 0.5) * 0.5 + 0.5;
        
        // Combine waves
        float pattern = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3);
        
        // Apply Bayer dithering
        float threshold = bayer8(pos);
        float dithered = step(threshold, pattern);
        
        // Theme colors
        vec3 color1 = vec3(0.067, 0.075, 0.129); // Dark background #111321
        vec3 color2 = vec3(0.608, 0.125, 0.392); // Primary pink #9B2064
        vec3 color3 = vec3(0.698, 0.290, 0.514); // Primary border #B24A83
        
        // More visible dithering effect
        vec3 baseColor = mix(color1, color2, pattern * 0.5);
        vec3 finalColor = mix(baseColor, color3, dithered * 0.25);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Compile shader
    function compileShader(source: string, type: number) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    // Create program
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up geometry (fullscreen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const time = (Date.now() - startTime) * 0.001;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
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

