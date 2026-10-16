export function mountAfternoonSunlight(canvas, options) {
  return mount(canvas, options);
}

const mount = (function(){var e=[[.8224621,.177538,0],[.0331941,.9668058,0],[.0170827,.0723974,.9105199]],t=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4;function n(n){let r=n.replace(`#`,``),i=r.length===3?[...r].map(e=>e+e).join(``):r,a=[0,2,4].map(e=>t(parseInt(i.slice(e,e+2),16)/255));return e.map(e=>e[0]*a[0]+e[1]*a[1]+e[2]*a[2])}var r=`#version 300 es
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}`,i=`#version 300 es
precision highp float;
uniform vec2 uView;   // full-resolution canvas size in device pixels (the original's viewportSize)
uniform vec2 uTarget; // size of the buffer being rendered
out vec4 outColor;

vec2 fragUV() {
  vec2 st = gl_FragCoord.xy / uTarget;
  return vec2(st.x, 1.0 - st.y);
}
vec4 samp(sampler2D t, vec2 uv) { return texture(t, vec2(uv.x, 1.0 - uv.y)); }
`,a=e=>`${i}
uniform float uNoiseT;
uniform float uBlobT;
uniform vec3 uBg;
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uScale;
uniform float uLacunarity;
uniform float uPersistence;
uniform float uContrast;
uniform float uSeed;
uniform vec2 uCenter; // blob center, measured from the top-left like the original's position prop
uniform float uSize;
uniform float uDeform;
uniform float uSoft;

const float TAU = 6.283185307179586;

vec2 cellHash2(vec2 p) {
  vec2 h = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(h) * 43758.5453);
}

// Squared distances to the nearest and second-nearest feature points (Euclidean, full jitter).
vec2 nearest2(vec2 suv, float animT, float seed) {
  float animTSlow = animT * 0.7;
  vec2 cell = floor(suv);
  vec2 local = fract(suv);
  float d1 = 10.0;
  float d2 = 10.0;
  for (int ny = -1; ny <= 1; ny++) {
    for (int nx = -1; nx <= 1; nx++) {
      vec2 offset = vec2(float(nx), float(ny));
      vec2 h = cellHash2(cell + offset + seed);
      vec2 pt = clamp(vec2(h.x + sin(animT + h.x * TAU) * 0.15, h.y + cos(animTSlow + h.y * TAU) * 0.15), 0.05, 0.95);
      vec2 d = local - (offset + pt);
      float dd = d.x * d.x + d.y * d.y;
      d2 = min(d2, max(dd, d1));
      d1 = min(d1, dd);
    }
  }
  return vec2(d1, d2);
}

// F2 - F1 with fractal octaves, normalised the same way as the original (mode scale 2.5).
float worley(vec2 base) {
  float freq = uScale;
  float amp = 1.0;
  float acc = 0.0;
  float total = 0.0;
  for (int o = 0; o < ${e}; o++) {
    float fo = float(o);
    vec2 dd = nearest2(base * freq, uNoiseT + fo * 17.0, uSeed + fo * 31.0);
    acc += (sqrt(dd.y) - sqrt(dd.x)) * amp;
    total += amp;
    amp *= uPersistence;
    freq *= uLacunarity;
  }
  return acc / max(total, 1e-4) * 2.5;
}

float blobMask(vec2 uv, float aspect) {
  vec2 c = vec2(uv.x * aspect - uCenter.x * aspect, uv.y - uCenter.y);
  float t = uBlobT;
  float wobble =
      (sin(c.x * 3.2 + t * 0.8) * sin(c.y * 2.8 + t * 0.6) + sin(c.x * 4.8 + c.y * -3.6 + t * -0.4)) * 0.15 * uDeform
    + sin(c.x * 5.6 + t * -0.5) * sin(c.y * 4.4 + t * 0.7) * 0.12 * uDeform
    + (sin(c.x * 7.2 + c.y * 6.4 + t * 0.3) + sin(c.x * 2.4 + t * -0.9)) * 0.1 * uDeform
    + sin(c.x * 8.8 + t * 0.2) * sin(c.y * 7.6 + t * -0.8) * 0.04 * uDeform;
  float radius = uSize + wobble;
  float edge = 1.0 - smoothstep(radius - uSoft * 0.3, radius + uSoft * 0.3, length(c));
  return edge <= 0.0 ? 0.0 : pow(edge, uSoft * 2.0 + 0.5);
}

void main() {
  vec2 uv = fragUV();
  float aspect = uView.x / max(uView.y, 1e-6);
  float mask = blobMask(uv, aspect);
  // Outside the blob the noise is fully masked: skip the expensive cellular search.
  if (mask <= 0.0) {
    outColor = vec4(uBg, 1.0);
    return;
  }
  float v = worley(vec2(uv.x * aspect, uv.y));
  float tone = clamp(((v * 2.0 - 1.0) * uContrast) * 0.5 + 0.5, 0.0, 1.0);
  outColor = vec4(mix(uBg, mix(uColA, uColB, tone), mask), 1.0);
}`,o=`${i}
uniform sampler2D uLayer;
uniform vec2 uStep; // full blur vector in uv; taps run from -0.5 to +0.5 of it

const float W[16] = float[16](
  0.01833924571930286, 0.02021849882901347, 0.02214582425503263, 0.024099625573710187,
  0.026055790002929013, 0.027988118222713798, 0.029868860752810644, 0.03166934789372045,
  0.033360694846059885, 0.03491455881584358, 0.03630392101960902, 0.03750386381383466,
  0.03849231191611351, 0.039250707006906665, 0.03976458694921195, 0.04002404438318769);

void main() {
  vec2 uv = fragUV();
  vec4 sum = vec4(0.0);
  for (int i = 0; i < 32; i++) {
    float t = float(i) / 31.0 - 0.5;
    sum += samp(uLayer, uv + uStep * t) * W[i < 16 ? i : 31 - i];
  }
  outColor = sum;
}`,s=`${i}
uniform sampler2D uBlur;
uniform vec2 uShift; // chromatic offset in uv for an offset multiplier of 1
uniform bool uAces;
uniform bool uEdgeOn;
uniform mat2 uEdgeInv;     // maps uv offsets from the canvas center onto the unit circle
uniform float uEdgeFeather; // fade width in uv, ending at the outline

// Coverage of the soft-edged ellipse: 1 inside, easing to 0 at the outline.
float edgeAlpha(vec2 uv) {
  vec2 q = uEdgeInv * (uv - 0.5);
  float r = length(q);
  vec2 grad = transpose(uEdgeInv) * q / max(r, 1e-6);
  float dist = (r - 1.0) / max(length(grad), 1e-6);
  return 1.0 - smoothstep(-max(uEdgeFeather, 1e-5), 0.0, dist);
}

vec3 linearToSrgb(vec3 c) {
  vec3 a = pow(c, vec3(0.41666001081466675)) * 1.055 - 0.055;
  vec3 b = c * 12.92;
  return mix(a, b, vec3(lessThanEqual(c, vec3(0.0031308000907301903))));
}

vec3 rrtAndODTFit(vec3 v) {
  vec3 a = v * (v + 0.0245786) - 9.0537e-5;
  vec3 b = v * ((v + 0.432951) * 0.983729) + 0.238081;
  return a / b;
}

vec3 toneAces(vec3 color) {
  vec3 c = color / 0.6;
  c = mat3(0.5971900224685669, 0.07599999755620956, 0.0284000001847744,
           0.35457998514175415, 0.9083399772644043, 0.1338299959897995,
           0.04822999984025955, 0.01565999910235405, 0.8377699851989746) * c;
  c = rrtAndODTFit(c);
  c = mat3(1.6047500371932983, -0.10208000242710114, -0.003269999986514449,
           -0.5310800075531006, 1.1081299781799316, -0.07276000082492828,
           -0.07366999983787537, -0.006049999967217445, 1.0760200023651123) * c;
  return clamp(c, 0.0, 1.0);
}

void main() {
  vec2 uv = fragUV();
  vec4 g = samp(uBlur, uv);
  vec4 c = vec4(samp(uBlur, uv - uShift).r, g.g, samp(uBlur, uv + uShift).b, g.a);
  vec3 rgb = c.a > 1e-3 ? c.rgb / c.a : vec3(0.0);
  float a = c.a * (uEdgeOn ? edgeAlpha(uv) : 1.0);
  outColor = vec4(linearToSrgb(uAces ? toneAces(rgb) : clamp(rgb, 0.0, 1.0)) * a, a);
}`,c={background:`#c4c4c4`,noiseShadow:`#a69f9f`,noiseHighlight:`#fcf8f0`,noiseContrast:.55,noiseLacunarity:2.3,noisePersistence:1,noiseSeed:33,noiseSpeed:3.3,maskSoftness:1.5,maskDeformation:.5,maskSpeed:.8,maskSeed:1,aberration:.15,aberrationAngle:0,toneMapping:`linear`},l={1:{...c,name:`Afternoon Sunlight 1`,noiseScale:3,maskCenter:[.26,.07],maskSize:.85,blurAngle:36,blurIntensity:300},2:{...c,name:`Afternoon Sunlight 2`,noiseScale:4,maskCenter:[.85,.16],maskSize:.85,blurAngle:135,blurIntensity:300},3:{...c,name:`Afternoon Sunlight 3`,noiseScale:2.5,maskCenter:[.53,.97],maskSize:.9,blurAngle:211,blurIntensity:500}};function u(e){"@babel/helpers - typeof";return u=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},u(e)}function d(e,t){if(u(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(u(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function f(e){var t=d(e,`string`);return u(t)==`symbol`?t:t+``}function p(e,t,n){return(t=f(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=270,h=()=>typeof matchMedia<`u`&&matchMedia(`(pointer: coarse)`).matches&&Math.min(screen.width,screen.height)<820;function g(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`shader compile failed`);return r}function _(e,t,n,r){let i=e.createProgram(),a=g(e,e.FRAGMENT_SHADER,n);if(e.attachShader(i,t),e.attachShader(i,a),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw Error(e.getProgramInfoLog(i)??`link failed`);e.deleteShader(a);let o={};for(let t of[`uView`,`uTarget`,...r])o[t]=e.getUniformLocation(i,t);return{program:i,u:o}}var v=class{constructor(e,t={}){p(this,`canvas`,void 0),p(this,`gl`,void 0),p(this,`preset`,void 0),p(this,`bufferScale`,void 0),p(this,`maxPixelRatio`,void 0),p(this,`layer`,void 0),p(this,`blur`,void 0),p(this,`final`,void 0),p(this,`layerOctaves`,-1),p(this,`vs`,void 0),p(this,`vao`,void 0),p(this,`targets`,null),p(this,`halfFloat`,void 0),p(this,`colors`,void 0),this.canvas=e;let n=e.getContext(`webgl2`,{alpha:!!t.edge,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!!t.edge,preserveDrawingBuffer:!1,powerPreference:`default`});if(!n)throw Error(`WebGL2 is not available`);this.gl=n,this.halfFloat=!!n.getExtension(`EXT_color_buffer_float`)||!!n.getExtension(`EXT_color_buffer_half_float`),this.bufferScale=t.bufferScale,this.maxPixelRatio=t.maxPixelRatio??(h()?1.5:2),this.vs=g(n,n.VERTEX_SHADER,r),this.vao=n.createVertexArray(),this.blur=_(n,this.vs,o,[`uLayer`,`uStep`]),this.final=_(n,this.vs,s,[`uBlur`,`uShift`,`uAces`,`uEdgeOn`,`uEdgeInv`,`uEdgeFeather`]),this.preset=l[2],this.setPreset(t.preset??2)}setPreset(e){this.preset=typeof e==`object`?e:l[e],this.colors={bg:n(this.preset.background),a:n(this.preset.noiseShadow),b:n(this.preset.noiseHighlight)},this.layerOctaves!==2&&(this.layer&&this.gl.deleteProgram(this.layer.program),this.layer=_(this.gl,this.vs,a(2),[`uNoiseT`,`uBlobT`,`uBg`,`uColA`,`uColB`,`uScale`,`uLacunarity`,`uPersistence`,`uContrast`,`uSeed`,`uCenter`,`uSize`,`uDeform`,`uSoft`]),this.layerOctaves=2)}setEdge(e){this.edge=e}setBufferScale(e){this.bufferScale=e,this.releaseTargets()}get effectiveBufferScale(){return this.bufferScale??Math.min(.5,m/Math.max(1,this.canvas.height))}get pixelRatio(){return Math.min(window.devicePixelRatio||1,this.maxPixelRatio)}resize(){let e=this.pixelRatio,t=Math.max(1,Math.round(this.canvas.clientWidth*e)),n=Math.max(1,Math.round(this.canvas.clientHeight*e));return t===this.canvas.width&&n===this.canvas.height&&this.targets?!1:(this.canvas.width=t,this.canvas.height=n,this.releaseTargets(),!0)}createTarget(e,t){let n=this.gl,r=n.createTexture();n.bindTexture(n.TEXTURE_2D,r),n.texStorage2D(n.TEXTURE_2D,1,this.halfFloat?n.RGBA16F:n.RGBA8,e,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let i=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,i),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,r,0),{tex:r,fbo:i,w:e,h:t}}releaseTargets(){if(this.targets){for(let e of Object.values(this.targets))this.gl.deleteTexture(e.tex),this.gl.deleteFramebuffer(e.fbo);this.targets=null}}ensureTargets(){if(this.targets)return this.targets;let e=this.effectiveBufferScale,t=Math.max(1,Math.round(this.canvas.width*e)),n=Math.max(1,Math.round(this.canvas.height*e));return this.targets={layer:this.createTarget(t,n),blur:this.createTarget(t,n)},this.targets}render(e,t){let n=this.gl,r=this.preset,{layer:i,blur:a}=this.ensureTargets(),o=this.canvas.width,s=this.canvas.height,c=o/s;n.bindVertexArray(this.vao),n.disable(n.BLEND),n.useProgram(this.layer.program);let l=this.layer.u;n.bindFramebuffer(n.FRAMEBUFFER,i.fbo),n.viewport(0,0,i.w,i.h),n.uniform2f(l.uView,o,s),n.uniform2f(l.uTarget,i.w,i.h),n.uniform1f(l.uNoiseT,t?t.noise:e*r.noiseSpeed),n.uniform1f(l.uBlobT,(t?t.blob:e*r.maskSpeed)+r.maskSeed),n.uniform3fv(l.uBg,this.colors.bg),n.uniform3fv(l.uColA,this.colors.a),n.uniform3fv(l.uColB,this.colors.b),n.uniform1f(l.uScale,r.noiseScale),n.uniform1f(l.uLacunarity,r.noiseLacunarity),n.uniform1f(l.uPersistence,r.noisePersistence),n.uniform1f(l.uContrast,r.noiseContrast),n.uniform1f(l.uSeed,r.noiseSeed),n.uniform2f(l.uCenter,r.maskCenter[0],r.maskCenter[1]),n.uniform1f(l.uSize,r.maskSize),n.uniform1f(l.uDeform,r.maskDeformation),n.uniform1f(l.uSoft,r.maskSoftness),n.drawArrays(n.TRIANGLES,0,3),n.useProgram(this.blur.program),l=this.blur.u,n.bindFramebuffer(n.FRAMEBUFFER,a.fbo),n.viewport(0,0,a.w,a.h),n.uniform2f(l.uView,o,s),n.uniform2f(l.uTarget,a.w,a.h);let u=r.blurAngle*Math.PI/180;n.uniform2f(l.uStep,Math.cos(u)/c*r.blurIntensity*2/o,Math.sin(u)*r.blurIntensity*2/s),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,i.tex),n.uniform1i(l.uLayer,0),n.drawArrays(n.TRIANGLES,0,3),n.useProgram(this.final.program),l=this.final.u,n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,o,s),n.uniform2f(l.uView,o,s),n.uniform2f(l.uTarget,o,s);let d=r.aberrationAngle*Math.PI/180;n.uniform2f(l.uShift,Math.cos(d)/c*r.aberration*.1,Math.sin(d)*r.aberration*.1),n.uniform1i(l.uAces,+(r.toneMapping===`aces`)),n.uniform1i(l.uEdgeOn,+!!this.edge),n.uniformMatrix2fv(l.uEdgeInv,!1,this.edge?this.edge.inv:[1,0,0,1]),n.uniform1f(l.uEdgeFeather,this.edge?this.edge.feather:0),n.bindTexture(n.TEXTURE_2D,a.tex),n.uniform1i(l.uBlur,0),n.drawArrays(n.TRIANGLES,0,3)}readPixels(){let e=this.gl,t=this.canvas.width,n=this.canvas.height,r=new Uint8Array(t*n*4);e.readPixels(0,0,t,n,e.RGBA,e.UNSIGNED_BYTE,r);let i=new Uint8Array(r.length);for(let e=0;e<n;e++)i.set(r.subarray((n-1-e)*t*4,(n-e)*t*4),e*t*4);return i}get context(){return this.gl}destroy(){this.releaseTargets();let e=this.gl;for(let t of[this.layer,this.blur,this.final])e.deleteProgram(t.program);e.deleteShader(this.vs),e.deleteVertexArray(this.vao)}},y=15.67,b=.1;function x(e,t={}){let n=new v(e,t),r=t.speed??1,i=!!t.paused,a=!0,o=0,s=-1,c=0,l=!0,u=e=>{if(c=0,s>=0&&e-s<y&&!l){d();return}let a=s<0?0:Math.min((e-s)/1e3,b);s=e,i||(o+=a*r);let u=performance.now();n.resize()&&(l=!0),n.render(o),l=!1,t.onFrame?.({time:o,cpuMs:performance.now()-u,dt:a}),d()},d=()=>{c||!a||document.hidden||(!i||l)&&(c=requestAnimationFrame(u))},f=()=>{c&&cancelAnimationFrame(c),c=0,s=-1},p=()=>{l=!0,d()},m=new ResizeObserver(p);m.observe(e);let h=new IntersectionObserver(([e])=>{a=e.isIntersecting,a?d():f()});h.observe(e);let g=()=>document.hidden?f():d();document.addEventListener(`visibilitychange`,g);let _=()=>p(),x=matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);return x.addEventListener(`change`,_),d(),{renderer:n,setPreset(e){n.setPreset(e),p()},setSpeed(e){r=e},play(){i=!1,s=-1,d()},pause(){i=!0},get time(){return o},destroy(){f(),m.disconnect(),h.disconnect(),document.removeEventListener(`visibilitychange`,g),x.removeEventListener(`change`,_),n.destroy()}}}return x;
})();
