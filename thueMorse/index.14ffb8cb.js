var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={},n={},r=t.parcelRequire94c2;null==r&&((r=function(t){if(t in e)return e[t].exports;if(t in n){var r=n[t];delete n[t];var i={id:t,exports:{}};return e[t]=i,r.call(i.exports,i,i.exports),i.exports}var a=Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(t,e){n[t]=e},t.parcelRequire94c2=r);var i=r("amYBK");class a{constructor(t=0,e=0,n=0,r=0){this.x=t,this.y=e,this.z=n,this.w=r}static fromHex(t){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);if(null===e)throw Error(`can't parse hex: ${t}`);return new a(parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16),255)}static #t=(()=>{this.zero=new a(0,0,0,0)})();static #e=(()=>{this.one=new a(1,1,1,1)})()}class l{constructor(t=0,e=0){this.x=t,this.y=e}toString(){return`Vec2(${this.x}, ${this.y})`}static #t=(()=>{this.tmp=new l(0,0)})();static #e=(()=>{this.tmp1=new l(0,0)})();static #n=(()=>{this.tmp2=new l(0,0)})();static #r=(()=>{this.tmp3=new l(0,0)})();static #i=(()=>{this.zero=new l(0,0)})();static #a=(()=>{this.one=new l(1,1)})();static set(t,e,n){return t.x=e,t.y=n,t}static copy(t,e){return(e=e||new l).x=t.x,e.y=t.y,e}static add(t,e,n){return(n=n||new l).x=t.x+e.x,n.y=t.y+e.y,n}static sub(t,e,n){return(n=n||new l).x=t.x-e.x,n.y=t.y-e.y,n}static mul(t,e,n){return(n=n||new l).x=t.x*e.x,n.y=t.y*e.y,n}static div(t,e,n){return(n=n||new l).x=t.x/e.x,n.y=t.y/e.y,n}static round(t,e){return(e=e||new l).x=Math.round(t.x),e.y=Math.round(t.y),e}static negate(t,e){return(e=e||new l).x=-t.x,e.y=-t.y,e}static scale(t,e,n){return(n=n||new l).x=t.x*e,n.y=t.y*e,n}static lerp(t,e,n,r){return(r=r||new l).x=t.x*(1-n)+e.x*n,r.y=t.y*(1-n)+e.y*n,r}static inBounds(t,e){var n,r,i,a;return n=t.x,r=e.x,n>=0&&n<r&&(i=t.y,a=e.y,i>=0&&i<a)}static onBorder(t,e){var n,r,i,a;return n=t.x,r=e.x,0==n||n+1===r||(i=t.y,a=e.y,0==i||i+1===a)}static isZero(t){return 0===t.x&&0===t.y}static equals(t,e){return t.x===e.x&&t.y===e.y}static map1(t,e,n){return(n=n||new l).x=e(t.x),n.y=e(t.y),n}static map2(t,e,n,r){return(r=r||new l).x=n(t.x,e.x),r.y=n(t.y,e.y),r}static roundToCardinal(t){return Math.abs(t.x)>=Math.abs(t.y)?t.x>=0?"xpos":"xneg":t.y>=0?"ypos":"yneg"}}const s=document.querySelector("#c"),c=s.getContext("2d");requestAnimationFrame(function t(e){var n,r,a,l,y,h;i.resizeCanvasToDisplaySize(s);let E=(e-v)*.001;v=e,c.fillStyle="#4E5E5E",c.fillRect(0,0,s.width,s.height),d+=E/.3,d=Math.min(1,d);let S=s.width,b=s.height;f&&(n=2*S,r=S,S=n*(1-(a=d))+r*a,l=2*b,y=b,b=l*(1-(h=d))+y*h),function t(e,n,r,i,a,l){if(a.length<x.length){let s=e,o=e+r/2,y=n+i/2;if(l&&(s=e+r/2,o=e),t(s,n,r/2,i/2,a.concat([0]),l),t(o,n,r/2,i/2,a.concat([1]),!l),t(o,y,r/2,i/2,a.concat([2]),!l),t(s,y,r/2,i/2,a.concat([3]),l),0==w(a)){let t=l?p:g;c.fillStyle=t[1];let s=r/8;0==x[x.length-1]&&(f?1==w(a,[0].concat(u)):1==w(a,u))&&(s*=d),m(e,n,r,i,s)}}else{let t=l?p:g,s=w(a);0==s&&(c.fillStyle=t[0],c.fillRect(e,n,r,i),c.fillStyle=t[1],m(e,n,r,i,r/8)),1==s&&(c.fillStyle=t[1],m(e,n,r,i,r/8))}}(0,0,S,b,[],!1),o&&(c.fillStyle="pink",c.textAlign="center",c.textBaseline="middle",c.font="60px Arial",c.fillText("Click to start",s.width/2,3*s.height/4)),requestAnimationFrame(t)}),document.addEventListener("keydown",function(t){switch(t.code){case"KeyA":case"KeyQ":case"KeyZ":h(!0);break;case"KeyD":case"KeyM":case"KeyP":h(!1)}}),document.addEventListener("click",function(t){o?o=!1:h(t.pageX<window.innerWidth/2)});let o=!0,y=0,u=[0],x=[0],f=!1,d=0;function h(t){d=0,t==function(t){let e=!0;for(;t>0;)t%2==1&&(e=!e),t>>=1;return e}(y)?(y+=1,f=x.every(t=>3==t),u=x.slice(),x=function(t){if(t.every(t=>3==t)){let e=Array(t.length+1).fill(0);return e[0]=1,e}let e=t.slice();for(let t=e.length-1;t>=0;t--){if(3!==e[t])return e[t]+=1,e;e[t]=0}throw Error("???")}(x),console.log("prev: ",u),console.log("cur: ",x)):(alert(`score: ${y}`),y=0,f=!1,x=[0])}function w(t,e){e=e||x;for(let n=0;n<Math.min(t.length,e.length);n++){if(t[n]<e[n])return 0;if(t[n]>e[n])return 2}return 1}const p=["red","pink","darkred"],g=["green","lime","darkgreen"];function m(t,e,n,r,i){c.fillRect(t,e,n,i),c.fillRect(t,e+r-i,n,i),c.fillRect(t,e,i,r),c.fillRect(t+n-i,e,i,r)}let v=0;
//# sourceMappingURL=index.14ffb8cb.js.map