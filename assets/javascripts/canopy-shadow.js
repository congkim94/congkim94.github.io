
(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`Shader compile failed`);return r}function t(t,n,r){let i=t.createProgram();if(t.attachShader(i,e(t,t.VERTEX_SHADER,n)),t.attachShader(i,e(t,t.FRAGMENT_SHADER,r)),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw Error(t.getProgramInfoLog(i)??`Program link failed`);let a=new Map;return{p:i,u:e=>(a.has(e)||a.set(e,t.getUniformLocation(i,e)),a.get(e))}}function n(e,t,n){let r=e.createBuffer(),i=e.createBuffer(),a=e.createVertexArray();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,r),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,i);for(let[r,i,a]of n)e.enableVertexAttribArray(r),e.vertexAttribPointer(r,i,e.FLOAT,!1,t*4,a*4);return e.bindVertexArray(null),{vao:a,vbo:r,ibo:i}}function r(e,t,n,r){e.bindVertexArray(t.vao),e.bindBuffer(e.ARRAY_BUFFER,t.vbo),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.ibo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,r,e.STATIC_DRAW),e.bindVertexArray(null)}var i=1024,a=.7,o=[Math.cos(53*Math.PI/180),Math.sin(53*Math.PI/180)],s=.85,c=[{freq:.45,zeta:.12,compliance:.009,width:.012},{freq:.9,zeta:.15,compliance:.026,width:.0065},{freq:2,zeta:.2,compliance:.07,width:.0034}],l=[{dx:.35,y:1.3,angle:3.5,length:1.55,depth:.25,leafy:1},{dx:.3,y:.8,angle:3.3,length:1.9,depth:.3,leafy:1},{dx:.25,y:.45,angle:3.12,length:2.95,depth:.35,leafy:.9},{dx:.25,y:-.15,angle:3.05,length:2.3,depth:.3,leafy:1},{dx:.2,y:-.75,angle:2.95,length:2.3,depth:.3,leafy:1},{dx:.2,y:-1.2,angle:2.85,length:2.55,depth:.3,leafy:1},{dx:-1.4,y:-1.3,angle:2.45,length:1.1,depth:.3,leafy:.9},{dx:.15,y:1.05,angle:3.7,length:1.3,depth:.2,leafy:.8},{dx:.1,y:.35,angle:3.6,length:1.1,depth:.15,leafy:1},{dx:.1,y:-.45,angle:2.7,length:1.1,depth:.15,leafy:1}];function u(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function d(e,t,n){let r=Math.imul(e,374761393)+Math.imul(t,668265263)+Math.imul(n,1274126177);return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296}function f(e){return e*e*e*(e*(e*6-15)+10)}function p(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=e-r,s=t-i,c=n-a,l=f(o),u=f(s),p=f(c),m=(e,t,n)=>e+(t-e)*n,h=(e,t,n)=>d(r+e,i+t,a+n);return m(m(m(h(0,0,0),h(1,0,0),l),m(h(0,1,0),h(1,1,0),l),u),m(m(h(0,0,1),h(1,0,1),l),m(h(0,1,1),h(1,1,1),l),u),p)*2-1}function m(e,t){let n=u(e*977+13),r=(e,t)=>e+(t-e)*n(),i=Math.max(t,1),o=e===0||n()<.5,s=[],c=[],d=[],f=[],p=e===0?l:l.map(e=>({...e,y:e.y+r(-.15,.15),angle:e.angle+r(-.1,.1),length:e.length*r(.88,1.1)})),m=e=>Math.max(-.3,Math.min(.5,(.1-e)*.45)),h=(e,t,i,a,o)=>{f.push({node:e,t,angle:i,length:a,width:a*r(.13,.18),depth:o,seed:n()*1e3})},g=(e,t,i,a,o,l,u)=>{let f=o===0?Math.max(4,Math.round(a/.26)):o===1?4:2,p=a/f,_=e,v=i,y=t[0],b=t[1];for(let e=0;e<f;e++){let i=r(-.14,.14)+(o===0?.035:0);v+=i;let a=s.length,x=Math.max(0,Math.min(2,l+(o>0?m(y):0)));s.push({parent:_,length:p,rest:_<0?v:v-c[_],order:o,depth:x}),c.push(v),e===0&&_<0&&d.push([t[0],t[1]]);let S=y+Math.cos(v)*p,C=b+Math.sin(v)*p;if(o===0){let t=n()<.35?2:1;for(let n=0;n<t;n++){let t=(e+n)%2==0?1:-1;g(a,[S,C],v+t*r(.55,1.1),r(.35,.7)*(.7+.3*u),1,l+.25,u)}}else o===1&&(n()<.75*u&&g(a,[S,C],v+(n()<.5?1:-1)*r(.5,1),r(.14,.26),2,l+.45,u),n()<.4*u&&g(a,[S,C],v+(n()<.5?1:-1)*r(.5,1),r(.12,.2),2,l+.45,u));if(o>=1){let t=Math.round((o===2?r(.6,2):r(0,1.3))*u);for(let e=0;e<t;e++){let t=e%2==0?1:-1,n=r(.11,.19),i=Math.max(0,Math.min(2,x+r(-.25,.3)));h(a,r(.1,1),t*r(.45,1),n,i)}o===2&&e===f-1&&h(a,1,r(-.2,.2),r(.11,.16),Math.max(0,Math.min(2,x+r(-.2,.2))))}y=S,b=C,_=a}};for(let e of p)g(-1,[i+e.dx,e.y-a],e.angle,e.length,0,e.depth,e.leafy);if(o){for(let e of s)e.rest=e.parent<0?Math.PI-e.rest:-e.rest;for(let e of d)e[0]=-e[0];for(let e of f)e.angle=-e.angle}return{nodes:s,roots:d,leaves:f,mirror:o}}var h=class{count;parent;len;rest;omega;zeta;gain;rootX;rootY;th;thV;ph;phV;force;wx;wy;wz;wa;wp;texData;time=0;lightX;constructor(e,t,n){this.lightX=n;let r=e.length;this.count=r,this.parent=new Int32Array(r),this.len=new Float32Array(r),this.rest=new Float32Array(r),this.omega=new Float32Array(r),this.zeta=new Float32Array(r),this.gain=new Float32Array(r),this.rootX=new Float32Array(r),this.rootY=new Float32Array(r),this.th=new Float32Array(r),this.thV=new Float32Array(r),this.ph=new Float32Array(r),this.phV=new Float32Array(r),this.force=new Float32Array(r),this.wx=new Float32Array(r),this.wy=new Float32Array(r),this.wz=new Float32Array(r),this.wa=new Float32Array(r),this.wp=new Float32Array(r);let a=Math.ceil(r/i)*2;this.texData=new Float32Array(i*a*4);let o=u(r*7+1),s=0;for(let n=0;n<r;n++){let r=e[n],i=c[r.order];this.parent[n]=r.parent,this.len[n]=r.length,this.rest[n]=r.rest;let a=i.freq*(.85+.3*o());this.omega[n]=2*Math.PI*a,this.zeta[n]=i.zeta,this.gain[n]=i.compliance*this.omega[n]*this.omega[n],r.parent<0&&(this.rootX[n]=t[s][0],this.rootY[n]=t[s][1],s++)}this.kinematics()}get rows(){return Math.ceil(this.count/i)*2}kinematics(){let{parent:e,len:t,rest:n,th:r,ph:i,wx:a,wy:o,wz:s,wa:c,wp:l}=this;for(let u=0;u<this.count;u++){let d=e[u],f=d<0?this.rootX[u]:a[d],p=d<0?this.rootY[u]:o[d],m=d<0?0:s[d],h=d<0?0:c[d],g=d<0?0:l[d],_=h+n[u]+r[u],v=g+i[u],y=t[u]*Math.cos(v);a[u]=f+Math.cos(_)*y,o[u]=p+Math.sin(_)*y,s[u]=m+t[u]*Math.sin(v),c[u]=_,l[u]=v}}wind(e,t,n){let r=.55+.35*p(n*.12,3.1,7.7),i=p(e*.55+n*.55,t*.55,n*.2),a=Math.max(0,i)**1.5*2.2,o=.45*p(e*1.6+n*1.1,t*1.6,n*.9)+.3*p(e*3.1+n*2.2,t*3.1+9,n*2.6);return r+a+o}step(e,t){if(e<=0)return;let n=this.time;for(let e=0;e<this.count;e++){let r=this.parent[e],i=r<0?this.rootX[e]:(this.wx[r]+this.wx[e])*.5,a=r<0?this.rootY[e]:(this.wy[r]+this.wy[e])*.5;this.force[e]=this.wind(i,a,n)*t}let r=Math.max(1,Math.ceil(e/(1/120))),i=e/r,{th:a,thV:o,ph:s,phV:c,omega:l,zeta:u,gain:d,force:f}=this;for(let e=0;e<r;e++)for(let e=0;e<this.count;e++){let t=l[e],n=f[e],r=-t*t*s[e]-2*u[e]*t*c[e]+d[e]*n;c[e]+=r*i,s[e]+=c[e]*i;let p=-t*t*a[e]-2*u[e]*t*o[e]+d[e]*.3*(n-.7)*Math.sin(e*12.9898);o[e]+=p*i,a[e]+=o[e]*i}this.time+=e,this.kinematics(),this.pack()}pack(){let e=this.texData,t=this.lightX*s,n=o[1]*s;for(let r=0;r<this.count;r++){let a=this.parent[r],o=a<0?this.rootX[r]:this.wx[a]+this.wz[a]*t,s=a<0?this.rootY[r]:this.wy[a]+this.wz[a]*n,c=this.wx[r]+this.wz[r]*t,l=this.wy[r]+this.wz[r]*n,u=r%i,d=Math.floor(r/i)*2,f=(d*i+u)*4;e[f]=o,e[f+1]=s,e[f+2]=c,e[f+3]=l;let p=((d+1)*i+u)*4;e[p]=this.force[r]}}},g=8;function _(e,t){let{nodes:n,roots:r,leaves:i,mirror:a}=m(e,t),s=[a?-o[0]:o[0],o[1]],l=new h(n,r,s[0]),u=[],d=[],f=0,p=(e,t,n,r,i,a,o,s,c,l)=>(u.push(e,t,n,r,i,a,o,s,c,l),f++);for(let e=0;e<n.length;e++){let t=n[e],r=c[t.order].width,i=t.parent>=0?n[t.parent].order:t.order,a=t.parent>=0&&i===t.order?r:r*1.15,o=r*.92,s=p(0,e,0,1,a,o,0,0,t.depth,0),l=p(0,e,0,-1,a,o,0,0,t.depth,0),u=p(0,e,1,1,a,o,0,0,t.depth,0),f=p(0,e,1,-1,a,o,0,0,t.depth,0);d.push(s,l,u,l,f,u)}for(let e of i){let t=null;for(let n=0;n<=g;n++){let r=n/g,i=p(1,e.node,e.t,1,e.angle,e.length,e.width,r,e.depth,e.seed),a=p(1,e.node,e.t,-1,e.angle,e.length,e.width,r,e.depth,e.seed);t&&d.push(t[0],t[1],i,t[1],a,i),t=[i,a]}}return{sim:l,light:s,vertices:new Float32Array(u),indices:new Uint32Array(d)}}var v=16,y=64;function b(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var x=[{x:-.55,y:-.7,angle:.75,length:2,curvature:-.1,depth:[0,.1],pairs:5,start:.25,leafLength:.8,leafWidth:.07,leftAngle:[1.5,.7],rightAngle:[-1.1,-.5],edgeOn:.3,crown:0},{x:-.25,y:-.4,angle:.98,length:1.95,curvature:-.2,depth:[.15,.4],pairs:5,start:.25,leafLength:.8,leafWidth:.085,leftAngle:[1.4,.6],rightAngle:[-.95,-.5],edgeOn:.4,crown:.3},{x:.05,y:-.42,angle:.2,length:2.2,curvature:.1,depth:[.5,1.05],pairs:6,start:.28,leafLength:.85,leafWidth:.085,leftAngle:[.75,.35],rightAngle:[-.55,-.3],edgeOn:.35,crown:.4},{x:.16,y:-.45,angle:1.1,length:2.3,curvature:-.14,depth:[.85,2],pairs:8,start:.14,leafLength:.88,leafWidth:.09,leftAngle:[1.75,.6],rightAngle:[-1.05,-.45],edgeOn:.7,crown:1}];function S(e){if(e===0)return x.map((e,t)=>({...e,seed:11+t*17.3}));let t=b(e),n=(e,n)=>e+(n-e)*t();return x.map((e,r)=>({...e,x:e.x+n(-.15,.15),y:e.y+n(-.15,.15),angle:e.angle+n(-.18,.18),length:e.length*n(.88,1.12),curvature:e.curvature+n(-.12,.12),pairs:e.pairs+Math.floor(n(-2,3)),leafLength:e.leafLength*n(.85,1.15),leftAngle:[e.leftAngle[0]+n(-.15,.15),e.leftAngle[1]+n(-.1,.1)],rightAngle:[e.rightAngle[0]+n(-.15,.15),e.rightAngle[1]+n(-.1,.1)],seed:t()*100+r}))}function C(e){let t=Math.min(1,Math.max(0,(e-.6)/.4));return 1-.35*t*t*(3-2*t)}function ee(e,t){let n=S(e),r=Math.max(t,1),i=Math.max(1/t,1),a=e!==0&&b(e+7)()<.5,o=b(e*31+5),s=[],c=[],l=0;for(let e of n){let t=a?r-e.x:-r+e.x,n=-i+e.y,u=a?Math.PI-e.angle:e.angle,d=a?-e.curvature:e.curvature,f=a?-1:1,p=t=>e.depth[0]+(e.depth[1]-e.depth[0])*t**1.6,m=(r,i,a,o,c,f,p,m,h,g,_)=>(s.push(t,n,u,e.length,d,e.seed,h,0,r,i,a,o,c,f,p,m,g,_),l++),h=(e,t,n,r,i,a,o,s,l)=>{let u=null;for(let d=0;d<=v;d++){let f=d/v,p=m(e,t,n,r,f,1,i,a,o,s,l),h=m(e,t,n,r,f,-1,i,a,o,s,l);u&&c.push(u[0],u[1],p,u[1],h,p),u=[p,h]}},g=.0058*e.length,_=null;for(let t=0;t<=y;t++){let n=t/y,r=m(n,0,0,g,0,1,0,0,0,e.depth[0],e.depth[1]-e.depth[0]),i=m(n,0,0,g,0,-1,0,0,0,e.depth[0],e.depth[1]-e.depth[0]);_&&c.push(_[0],_[1],r,_[1],i,r),_=[r,i]}for(let t=0;t<e.pairs;t++)for(let n of[1,-1]){let r=Math.min(1,(t+(n<0?.5:0)+(o()-.5)*.35)/e.pairs),i=e.start+(.985-e.start)*(1-(1-r)**2.8);if(i>.99)continue;let a=e.leafLength*C(i)*(.85+.3*o()),s=1-e.edgeOn*(1-Math.min(1,Math.max(0,(i-.2)/.38))),c=a*e.leafWidth*s*(.65+.5*o()),l=n>0?e.leftAngle:e.rightAngle;h(i,n,a,c,f*(l[0]+(l[1]-l[0])*r+(o()-.5)*.4),(o()-.5)*.35,(.25+.5*o())*(1-.6*i),p(i)+(o()-.5)*.35,0)}let b=Math.round(e.crown*8);for(let t=0;t<b;t++){let t=.84+.15*o(),n=o()<.5?1:-1,r=e.leafLength*(.3+.35*o());h(t,n,r,r*(.04+.06*o()),f*n*(.08+.55*o()),(o()-.5)*.6,.1,p(t)-o()*.2,0)}}return{vertices:new Float32Array(s),indices:new Uint32Array(c)}}var w=`
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

// Quintic value noise in [-1, 1]; C2-continuous so motion never visibly "kinks".
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(hash(i), hash(i + 1.0), u) * 2.0 - 1.0;
}
`,te=`#version 300 es
precision highp float;

layout(location = 0) in vec4 aFrond;   // root.xy, base angle, length
layout(location = 1) in vec4 aFrond2;  // rest curvature, seed, leaflet droop, -
layout(location = 2) in vec4 aPinna;   // s along rachis, side (0 = rachis), length, half-width
layout(location = 3) in vec2 aLocal;   // u along leaflet, v across
layout(location = 4) in vec2 aShape;   // leaflet angle from stem, leaflet curl
layout(location = 5) in vec2 aDepth;   // shadow depth at the base, change toward the tip

out float vDepth;
out float vStem;

uniform float uTime;
uniform float uWind;
uniform vec2 uExtent; // world half-size of the viewport

${w}

float gBase, gRest, gSway, gBend, gWave, gSeed, gT;

// Tangent angle of the rachis at arc length s (0 = root, 1 = tip).
float theta(float s) {
  return gBase + gSway + gRest * s
       + gBend * (0.3 * s + 0.7 * s * s)
       + gWave * s * noise(s * 2.2 - gT * 1.1 + gSeed * 7.0);
}

vec2 dir(float a) { return vec2(cos(a), sin(a)); }

// Point at distance u along a circular arc starting with heading a and curvature k.
vec2 arc(float a, float k, float u) {
  if (abs(k) < 1e-3) return dir(a) * u;
  return vec2(sin(a + k * u) - sin(a), cos(a) - cos(a + k * u)) / k;
}

void main() {
  vec2 root = aFrond.xy;
  float L = aFrond.w;
  gBase = aFrond.z;
  gRest = aFrond2.x;
  gSeed = aFrond2.y;

  // The wind reaches plants on the left slightly before those on the right.
  gT = uTime - root.x * 0.25;

  // Slow gust envelope modulating how hard the frond swings.
  float gust = 0.75 + 0.3 * noise(gT * 0.13 + 1.7) + 0.12 * noise(gT * 0.37 + 5.3);

  float h1 = hash(gSeed * 3.1);
  float freq = 0.5 + 0.14 * h1;

  // Irregular 3–4 s sway, as measured on the reference footage: the whole frond
  // pivots about its base by roughly ±3°, while the tip trails the base slightly.
  float sway = 0.72 * noise(gT * freq + gSeed * 17.0)
             + 0.28 * noise(gT * freq * 2.3 + gSeed * 29.0);
  float swayLag = 0.72 * noise((gT - 0.35) * freq + gSeed * 17.0)
                + 0.28 * noise((gT - 0.35) * freq * 2.3 + gSeed * 29.0);

  vec2 wind = normalize(vec2(1.0, 0.1));
  vec2 d0 = dir(gBase);
  float torque = d0.x * wind.y - d0.y * wind.x;

  gSway = uWind * (0.065 * sway * gust + 0.012 * gust * torque);
  gBend = uWind * (0.04 * swayLag * gust + 0.015 * gust * torque);
  gWave = uWind * 0.025 * gust;

  float s = aPinna.x;
  float side = aPinna.y;

  vec2 p = vec2(0.0);
  const int STEPS = 24;
  float ds = s / float(STEPS);
  for (int i = 0; i < STEPS; i++) {
    p += dir(theta((float(i) + 0.5) * ds)) * ds;
  }
  p = root + p * L;
  float th = theta(s);

  vec2 pos;
  float depth;
  if (side * side < 0.5) {
    float w = aPinna.w * (1.0 - 0.72 * s);
    pos = p + vec2(-sin(th), cos(th)) * aLocal.y * w;
    depth = aDepth.x + aDepth.y * pow(s, 1.6);
    vStem = 1.0;
  } else {
    vStem = 0.0;
    float u = aLocal.x;
    float hp = hash(s * 91.7 + side * 13.1 + gSeed);

    // Each leaflet trembles on its own, a little faster than the frond sways.
    float flutter = uWind * (0.03 + 0.025 * gust) * (0.6 + 0.6 * s)
                  * noise(uTime * (0.8 + 0.6 * hp) + hp * 50.0);

    // Leaflets are rigid: they swing about their attachment point but never change
    // outline, bend or focus, so their edges stay solid while they move.
    float a0 = th + aShape.x + flutter;
    // Gravity bows long leaflets downward; computed from the rest pose so the bow is fixed.
    float aRest = gBase + gRest * s + aShape.x;
    float k = aShape.y - aFrond2.z * cos(aRest);
    float au = a0 + k * u;

    // Lanceolate outline: narrow at the stem, widest about a third of the way out, pointed tip.
    float taper = pow(sin(3.14159265 * pow(u, 0.7)), 0.85);
    float w = aPinna.w * taper;
    pos = p + arc(a0, k, u) * aPinna.z + vec2(-sin(au), cos(au)) * aLocal.y * w;
    depth = aDepth.x + aDepth.y * u;
  }

  vDepth = clamp(depth, 0.0, 2.0);
  gl_Position = vec4(pos / uExtent, 0.0, 1.0);
}
`,T=`#version 300 es
precision mediump float;
in float vDepth;
in float vStem;
out vec4 outColor;
void main() {
  float x = vDepth * 1.5;
  float level = floor(x + 0.5);
  vec4 c = vec4(equal(vec4(level), vec4(0.0, 1.0, 2.0, 3.0)));
  // Stems sweep through several depths; near each transition write both neighbouring
  // levels so the two blurs overlap instead of leaving a lighter notch at the seam.
  float f = x + 0.5 - level;
  if (vStem > 0.5) {
    if (f < 0.2) c = max(c, vec4(equal(vec4(level - 1.0), vec4(0.0, 1.0, 2.0, 3.0))));
    if (f > 0.8) c = max(c, vec4(equal(vec4(level + 1.0), vec4(0.0, 1.0, 2.0, 3.0))));
  }
  outColor = c;
}
`,E=`#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`,ne=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec4 uSigma; // pixels, per channel
out vec4 outColor;

const int R = 10;
void main() {
  vec4 acc = vec4(0.0);
  float wsum = 0.0;
  vec4 stepPx = uSigma * (3.0 / float(R));
  for (int i = -R; i <= R; i++) {
    float fi = float(i);
    float x = fi * 3.0 / float(R);
    float w = exp(-0.5 * x * x);
    acc.r += texture(uTex, vUv + uTexel * fi * stepPx.r).r * w;
    acc.g += texture(uTex, vUv + uTexel * fi * stepPx.g).g * w;
    acc.b += texture(uTex, vUv + uTexel * fi * stepPx.b).b * w;
    acc.a += texture(uTex, vUv + uTexel * fi * stepPx.a).a * w;
    wsum += w;
  }
  outColor = acc / wsum;
}
`,re=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uMask;
uniform float uTime;
uniform float uStrength;
uniform vec2 uExtent;
uniform vec3 uWallLit;   // wall colour nearest the light
uniform vec3 uWallDim;   // wall colour across the frame from the light
uniform vec3 uShade;     // fraction of each channel that survives inside a shadow
uniform vec2 uLightPos;  // in viewport units, (1, 1) = top-right corner
out vec4 outColor;

float hash2(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec4 m = texture(uMask, vUv);

  // Overlapping occluders each block a share of the light that reaches them, so their
  // shadows combine multiplicatively and neither one's edge shifts where they overlap.
  vec4 t = 1.0 - clamp(m, 0.0, 1.0);
  float occlusion = (1.0 - t.r * t.g * t.b * t.a) * uStrength;

  vec2 p = (vUv * 2.0 - 1.0) * uExtent;
  float d = length(p - uLightPos * uExtent) / (2.0 * max(uExtent.x, uExtent.y));
  vec3 wall = mix(uWallLit, uWallDim, clamp(d, 0.0, 1.2));

  vec3 col = wall * mix(vec3(1.0), uShade, occlusion);
  col += (hash2(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) / 255.0 * 1.5;
  outColor = vec4(col, 1.0);
}
`,ie=`#version 300 es
precision highp float;

layout(location = 0) in vec4 aA; // kind (0 branch, 1 leaf), node index, t along node, side
layout(location = 1) in vec4 aB; // branch: start width, end width | leaf: angle, length, half-width, u
layout(location = 2) in vec2 aC; // depth, seed

uniform highp sampler2D uNodes; // simulated branch segments, already projected to shadow space
uniform float uTime;
uniform float uWind;
uniform vec2 uExtent;
uniform vec2 uLight;           // shadow slide direction for motion toward the wall

out float vDepth;
out float vStem;

${w}

vec4 node(int i, int row) {
  return texelFetch(uNodes, ivec2(i % 1024, (i / 1024) * 2 + row), 0);
}

void main() {
  int idx = int(aA.y + 0.5);
  vec4 se = node(idx, 0);
  vec2 s = se.xy;
  vec2 e = se.zw;
  vec2 d = e - s;
  vec2 dir = d / max(length(d), 1e-5);
  vec2 nrm = vec2(-dir.y, dir.x);

  vec2 pos;
  if (aA.x < 0.5) {
    float w = mix(aB.x, aB.y, aA.z);
    // Overlap neighbouring segments slightly so joints stay closed.
    pos = mix(s - dir * w, e + dir * w * 0.5, aA.z) + nrm * aA.w * w;
  } else {
    float wind = node(idx, 1).x;
    float seed = aC.y;
    float h = hash(seed);
    vec2 base = mix(s, e, aA.z);

    // Leaves are rigid. They flutter on their petiole at 3–5 Hz in proportion to the local
    // wind, and rock toward the wall, which slides their shadow along the light direction.
    float flutter = wind * (0.07 * noise(uTime * (3.0 + 1.6 * h) + seed)
                                  + 0.035 * noise(uTime * (5.2 + h) + seed * 1.7));
    float rock = wind * 0.01 * noise(uTime * (2.4 + 1.2 * h) + seed * 5.3);

    float a = atan(dir.y, dir.x) + aB.x + flutter;
    vec2 ld = vec2(cos(a), sin(a));
    vec2 ln = vec2(-ld.y, ld.x);
    float u = aB.w;
    // Elliptic leaf, widest a little below the middle, pointed tip.
    float taper = pow(sin(3.14159265 * pow(u, 0.85)), 0.7);
    pos = base + ld * (aB.y * u) + ln * (aA.w * aB.z * taper) + uLight * rock;
  }

  vDepth = clamp(aC.x, 0.0, 2.0);
  vStem = 0.0;
  gl_Position = vec4(pos / uExtent, 0.0, 1.0);
}
`,ae=class{sigma=[.02,.0115,.0062,.0028];prog;geo;count=0;key=``;seed=0;gl;constructor(e){this.gl=e,this.prog=t(e,te,T),this.geo=n(e,18,[[0,4,0],[1,4,4],[2,4,8],[3,2,12],[4,2,14],[5,2,16]])}setSeed(e){this.seed=e,this.key=``}update(e,t,n){let i=`${this.seed}:${n.toFixed(1)}`;if(i===this.key)return;this.key=i;let a=ee(this.seed,n);r(this.gl,this.geo,a.vertices,a.indices),this.count=a.indices.length}draw(e,t,n){let r=this.gl;r.useProgram(this.prog.p),r.uniform1f(this.prog.u(`uTime`),e),r.uniform1f(this.prog.u(`uWind`),t),r.uniform2f(this.prog.u(`uExtent`),n[0],n[1]),r.bindVertexArray(this.geo.vao),r.drawElements(r.TRIANGLES,this.count,r.UNSIGNED_INT,0)}},oe=12,D=class{sigma=[.017,.0088,.0052,.003];prog;geo;tex;count=0;sim=null;light=[0,1];key=``;seed=0;gl;constructor(e){this.gl=e,this.prog=t(e,ie,T),this.geo=n(e,10,[[0,4,0],[1,4,4],[2,2,8]]),this.tex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.tex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)}setSeed(e){this.seed=e,this.key=``}update(e,t,n){let a=`${this.seed}:${n.toFixed(1)}`;if(a!==this.key){this.key=a;let e=_(this.seed,n);r(this.gl,this.geo,e.vertices,e.indices),this.count=e.indices.length,this.sim=e.sim,this.light=e.light;for(let e=0;e<oe;e+=1/30)this.sim.step(1/30,t);let o=this.gl;o.bindTexture(o.TEXTURE_2D,this.tex),o.texImage2D(o.TEXTURE_2D,0,o.RGBA32F,i,this.sim.rows,0,o.RGBA,o.FLOAT,this.sim.texData);return}if(!this.sim||e<=0)return;this.sim.step(Math.min(e,1/15),t);let o=this.gl;o.bindTexture(o.TEXTURE_2D,this.tex),o.texSubImage2D(o.TEXTURE_2D,0,0,0,i,this.sim.rows,o.RGBA,o.FLOAT,this.sim.texData)}draw(e,t,n){let r=this.gl;r.useProgram(this.prog.p),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,this.tex),r.uniform1i(this.prog.u(`uNodes`),0),r.uniform1f(this.prog.u(`uTime`),e),r.uniform1f(this.prog.u(`uWind`),t),r.uniform2f(this.prog.u(`uExtent`),n[0],n[1]),r.uniform2f(this.prog.u(`uLight`),this.light[0],this.light[1]),r.bindVertexArray(this.geo.vao),r.drawElements(r.TRIANGLES,this.count,r.UNSIGNED_INT,0)}},se=.75,ce=class{gl;blur;composite;quadVao;scenes={};scene;sceneId;targets=null;msaa=null;maskW=1;maskH=1;halfFloat;seed;quality=1;canvas;constructor(e,n,r){this.canvas=e;let i=e.getContext(`webgl2`,{antialias:!0,alpha:!1,premultipliedAlpha:!1});if(!i)throw Error(`WebGL2 is not available in this browser.`);this.gl=i,this.seed=n,this.halfFloat=!!i.getExtension(`EXT_color_buffer_float`),this.blur=t(i,E,ne),this.composite=t(i,E,re),this.quadVao=i.createVertexArray(),this.sceneId=r,this.scene=this.getScene(r)}getScene(e){let t=this.scenes[e];return t||(t=e===`canopy`?new D(this.gl):new ae(this.gl),t.setSeed(this.seed),this.scenes[e]=t),t}setScene(e){this.sceneId=e,this.scene=this.getScene(e),this.scene.setSeed(this.seed)}aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}reseed(e){this.seed=e,this.scene.setSeed(e)}createTarget(e,t){let n=this.gl,r=n.createTexture();n.bindTexture(n.TEXTURE_2D,r),this.halfFloat?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,e,t,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let i=n.createFramebuffer();return n.bindFramebuffer(n.FRAMEBUFFER,i),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,r,0),n.checkFramebufferStatus(n.FRAMEBUFFER)!==n.FRAMEBUFFER_COMPLETE&&this.halfFloat?(this.halfFloat=!1,n.deleteFramebuffer(i),n.deleteTexture(r),this.createTarget(e,t)):{fbo:i,tex:r}}createMsaa(e,t){let n=this.gl;this.msaa&&=(n.deleteFramebuffer(this.msaa.fbo),n.deleteRenderbuffer(this.msaa.rb),null);let r=this.halfFloat?n.RGBA16F:n.RGBA8,i=Math.min(4,n.getInternalformatParameter(n.RENDERBUFFER,r,n.SAMPLES)?.[0]??0);if(i<2)return;let a=n.createRenderbuffer();n.bindRenderbuffer(n.RENDERBUFFER,a),n.renderbufferStorageMultisample(n.RENDERBUFFER,i,r,e,t);let o=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,o),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,a),n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE?this.msaa={fbo:o,rb:a}:(n.deleteFramebuffer(o),n.deleteRenderbuffer(a))}resize(){let e=Math.min(window.devicePixelRatio||1,2),t=Math.max(1,this.canvas.clientWidth),n=Math.max(1,this.canvas.clientHeight),r=Math.max(1,Math.round(t*e*this.quality)),i=Math.max(1,Math.round(n*e*this.quality));(this.canvas.width!==r||this.canvas.height!==i)&&(this.canvas.width=r,this.canvas.height=i);let a=se*Math.max(.35,this.quality),o=Math.max(1,Math.round(t*a)),s=Math.max(1,Math.round(n*a));if(!this.targets||o!==this.maskW||s!==this.maskH){let e=this.gl;if(this.targets)for(let t of this.targets)e.deleteFramebuffer(t.fbo),e.deleteTexture(t.tex);this.maskW=o,this.maskH=s,this.targets=[this.createTarget(o,s),this.createTarget(o,s)],this.createMsaa(o,s)}}render(e,t,n){this.resize();let r=this.gl,[i,a]=this.targets,o=this.aspect(),s=[Math.max(o,1),Math.max(1/o,1)];this.scene.update(t,n.wind,o),r.bindFramebuffer(r.FRAMEBUFFER,this.msaa?this.msaa.fbo:i.fbo),r.viewport(0,0,this.maskW,this.maskH),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.enable(r.BLEND),r.blendEquation(r.MAX),this.scene.draw(e,n.wind,s),r.colorMask(!0,!0,!0,!0),r.disable(r.BLEND),r.blendEquation(r.FUNC_ADD),this.msaa&&(r.bindFramebuffer(r.READ_FRAMEBUFFER,this.msaa.fbo),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,i.fbo),r.blitFramebuffer(0,0,this.maskW,this.maskH,0,0,this.maskW,this.maskH,r.COLOR_BUFFER_BIT,r.NEAREST),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null));let c=this.scene.sigma.map(e=>e*Math.min(this.maskW,this.maskH)*n.softness);r.useProgram(this.blur.p),r.bindVertexArray(this.quadVao),r.uniform4f(this.blur.u(`uSigma`),c[0],c[1],c[2],c[3]),r.uniform1i(this.blur.u(`uTex`),0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,a.fbo),r.bindTexture(r.TEXTURE_2D,i.tex),r.uniform2f(this.blur.u(`uTexel`),1/this.maskW,0),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,i.fbo),r.bindTexture(r.TEXTURE_2D,a.tex),r.uniform2f(this.blur.u(`uTexel`),0,1/this.maskH),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,this.canvas.width,this.canvas.height),r.useProgram(this.composite.p),r.bindTexture(r.TEXTURE_2D,i.tex);let l=this.composite.u,u=n.palette;r.uniform1i(l(`uMask`),0),r.uniform1f(l(`uTime`),e),r.uniform1f(l(`uStrength`),n.strength),r.uniform2f(l(`uExtent`),s[0],s[1]),r.uniform3fv(l(`uWallLit`),u.wallLit.map(e=>e/255)),r.uniform3fv(l(`uWallDim`),u.wallDim.map(e=>e/255)),r.uniform3fv(l(`uShade`),u.shade),r.uniform2fv(l(`uLightPos`),u.lightPos),r.drawArrays(r.TRIANGLES,0,3)}snapshot(){return this.canvas.toDataURL(`image/png`)}},O=(e,t)=>({wallLit:e,wallDim:e,shade:t,lightPos:[0,0]}),k={palm:{tab:`Palm`,title:`Fern Shadow`,blurb:`Soft light through a palm frond, moved by the wind.`,palettes:[{label:`Studio white`,swatch:`#f6f6f6`,palette:{wallLit:[255,255,255],wallDim:[242,242,242],shade:[.617,.637,.621],lightPos:[1,1]}},{label:`Morning linen`,swatch:`#efe7da`,palette:{wallLit:[252,247,238],wallDim:[232,223,209],shade:[.6,.6,.63],lightPos:[-1,1]}},{label:`Golden hour`,swatch:`#ecc89c`,palette:{wallLit:[255,232,196],wallDim:[228,196,160],shade:[.55,.56,.68],lightPos:[1,.6]}},{label:`Blue dusk`,swatch:`#b6c0d0`,palette:{wallLit:[226,232,242],wallDim:[190,198,214],shade:[.6,.63,.74],lightPos:[-.6,1]}}]},canopy:{tab:`Canopy`,title:`Canopy Shadow`,blurb:`A leafy shrub in a gusty breeze, simulated branch by branch.`,palettes:[{label:`Daylight white`,swatch:`#f2f1f1`,palette:O([242,241,241],[.665,.678,.694])},{label:`Warm plaster`,swatch:`#f1e9de`,palette:O([241,233,222],[.62,.63,.68])},{label:`Sage`,swatch:`#dfe3da`,palette:O([223,227,218],[.64,.67,.68])},{label:`Clay`,swatch:`#e2c7b3`,palette:O([226,199,179],[.6,.6,.68])}]}},A={wind:1,speed:1,softness:1,strength:1,palette:k.palm.palettes[0].palette};
export function mountCanopyShadow(canvas) {
  if (!canvas) return;

  var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = {
    wind: 1,
    speed: 1,
    softness: 1,
    strength: 1,
    palette: k.canopy.palettes[0].palette,
  };
  var renderer;

  try {
    renderer = new ce(canvas, 0, "canopy");
  } catch (error) {
    console.warn("Canopy shader unavailable.", error);
    return;
  }

  var time = 40;
  var last = performance.now();
  var frames = 0;
  var sampleAt = last;
  var raf = 0;

  function draw(now) {
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    var step = motionOk ? dt * state.speed : 0;
    time += step;
    renderer.render(time, step, state);

    if (!canvas.classList.contains("is-ready")) {
      canvas.classList.add("is-ready");
    }

    if (!motionOk) return;

    frames += 1;
    if (now - sampleAt >= 700) {
      var average = (now - sampleAt) / frames;
      sampleAt = now;
      frames = 0;
      if (average > 34 && renderer.quality > 0.25) {
        renderer.quality = Math.max(0.25, renderer.quality * Math.min(0.8, Math.sqrt(30 / average)));
      }
    }
    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  window.addEventListener("pagehide", function () {
    cancelAnimationFrame(raf);
  });
}
