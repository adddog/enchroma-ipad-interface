
const VERTEX_BUFFER = [0, 0, 0, 1, 1, 0, 1, 1];
const Single = (regl, props) => {
  return regl({
     vert: `
            precision highp float;
            attribute vec2 position;
            uniform mat4 projection, view, model;
            varying vec2 vUv;

            void main () {
              vUv = position;
              vec2 adjusted = 1.0 - 2.0 * position;
              vec4 pos =  vec4(adjusted,0,1);
              gl_Position =  pos;
            }
         `,

    frag: `
      precision highp float;
      #define PI  3.14159265359;
      #define TAO  6.283185307;
      // uniform sampler2D texture;
      varying vec2 vUv;

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float circle(in vec2 _st, in float _radius){
            vec2 dist = _st-vec2(0.5);
          return 1.-smoothstep(_radius-(_radius*0.001),
                                 _radius+(_radius*0.001),
                                 dot(dist,dist)*4.0);
        }

      void main () {
        vec2 uv = vUv;
        uv *= 2.0;
        uv -= 1.0;
        float r = sqrt(uv.x * uv.x + uv.y * uv.y);
        float deg = atan(uv.x, uv.y) / TAO;
        // vec3 color = texture2D(texture, uv).rgb;
        vec3 circleColor = vec3(circle(vUv,1.0));
        vec3 color = circleColor * vec3(hsv2rgb(vec3(deg, 0.5, 1.0)));
        // color = Posterize(color);
        gl_FragColor = vec4(color,1);
      }`,

     attributes: {
      position: VERTEX_BUFFER,
    },
    primitive: "triangle strip",
    count: 4,
    depth: {
      mask: false,
      enable: false,
    },
    uniforms: {
      //texture: regl.prop("tex0"),
    },
  })
};
export default Single
