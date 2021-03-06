import {
  Vector2
} from '@/lib/three.module.js'

var GaussianBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(1.0, 1.0) },
    direction: { value: new Vector2(1.0, 0.0) },
    kernelRadius: { value: 2 },
    sigma: { value: 2.0 }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 tSize;
    uniform vec2 direction;
    uniform int kernelRadius;
    uniform float sigma;

    varying vec2 vUv;

    const float inverse_sqrt_2p = 0.39894228;
    const float f2 = 2.0;
    const float f1 = 1.0;
    const float f0 = 0.0;
    const int i1 = 1;

    // 生成一个x位置的一维正态分布值
    float oneDimensionalGaussian (in float x) {
      return inverse_sqrt_2p / sigma * exp((-x * x) / (f2 * sigma * sigma));
    }
    
    void main() {
      vec2 unitSize = f1 / tSize;
      float weightSum = oneDimensionalGaussian(f0);
      vec3 diffuseSum = texture2D( tDiffuse, vUv).rgb * weightSum;

      // 这里其实是从-(kernelRadius - 1) kernelRadius - 1
      for (int i = i1; i < kernelRadius; i++ ) {
        float x = float(i);
        float w = oneDimensionalGaussian(x);
        vec2 offset = direction * x * unitSize;
        vec3 sampler1 = texture2D(tDiffuse, vUv + offset).rgb;
        vec3 sampler2 = texture2D(tDiffuse, vUv - offset).rgb;
        diffuseSum += (sampler1 + sampler2) * w;
        weightSum += w * f2;
      }

    	gl_FragColor = vec4(diffuseSum / weightSum, 1.0);
    }
  `
}

export { GaussianBlurShader }
