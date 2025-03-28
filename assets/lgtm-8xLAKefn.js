import{u as p,r as m,j as e}from"./index-q3XFI04l.js";const y=({onImageSelect:r})=>{const{t:a}=p(),l=m.useRef(null),s=n=>{const o=n.target.files;o&&o.length>0&&r(o[0])},t=()=>{var n;(n=l.current)==null||n.click()};return e.jsxs("div",{className:"mb-6",children:[e.jsx("input",{type:"file",ref:l,onChange:s,accept:"image/*",className:"hidden"}),e.jsx("button",{onClick:t,className:"w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors",children:a("upload")})]})},j=({imageUrl:r,alt:a="Preview"})=>e.jsx("div",{className:"mb-6 border border-gray-200 rounded-md overflow-hidden bg-gray-50",children:e.jsx("img",{src:r,alt:a,className:"block max-w-full max-h-96 mx-auto"})}),C=({text:r,onTextChange:a,posX:l,posY:s,onPositionChange:t,fontSize:n,onFontSizeChange:o})=>{const{t:c}=p(),d=x=>{a(x.target.value)},u=x=>{const f=Number(x.target.value)/100;t(f,s)},h=x=>{const f=Number(x.target.value)/100;t(l,f)},b=x=>{o(Number(x.target.value))};return e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"text-input",className:"block mb-2 font-medium",children:c("text")}),e.jsx("input",{id:"text-input",type:"text",value:r,onChange:d,className:"w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"LGTM"})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{htmlFor:"position-x",className:"block mb-2 font-medium",children:[c("position")," X"]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"position-x",type:"range",min:"0",max:"100",value:l*100,onChange:u,className:"w-[85%] mr-2"}),e.jsxs("span",{className:"min-w-[40px] text-right text-sm text-gray-600",children:[Math.round(l*100),"%"]})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{htmlFor:"position-y",className:"block mb-2 font-medium",children:[c("position")," Y"]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"position-y",type:"range",min:"0",max:"100",value:s*100,onChange:h,className:"w-[85%] mr-2"}),e.jsxs("span",{className:"min-w-[40px] text-right text-sm text-gray-600",children:[Math.round(s*100),"%"]})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"font-size",className:"block mb-2 font-medium",children:c("size")}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"font-size",type:"range",min:"12",max:"120",value:n,onChange:b,className:"w-[85%] mr-2"}),e.jsxs("span",{className:"min-w-[40px] text-right text-sm text-gray-600",children:[n,"px"]})]})]})]})},U=async(r,a)=>new Promise((l,s)=>{const t=new Image,n=new FileReader;n.onload=o=>{if(!o.target||typeof o.target.result!="string"){s(new Error("Failed to load image"));return}t.onload=()=>{const c=document.createElement("canvas"),d=c.getContext("2d");if(!d){s(new Error("Failed to get canvas context"));return}c.width=t.width,c.height=t.height,d.drawImage(t,0,0),d.font=`${a.fontSize}px ${a.fontFamily}`,d.fillStyle=a.color,d.textAlign="center",d.fillText(a.content,a.x*t.width,a.y*t.height);const u=c.toDataURL("image/png");l(u)},t.onerror=()=>{s(new Error("Failed to load image"))},t.src=o.target.result},n.onerror=()=>{s(new Error("Failed to read file"))},n.readAsDataURL(r)}),R=r=>{var o;const a=r.split(","),l=((o=a[0].match(/:(.*?);/))==null?void 0:o[1])||"image/png",s=atob(a[1]);let t=s.length;const n=new Uint8Array(t);for(;t--;)n[t]=s.charCodeAt(t);return new Blob([n],{type:l})},k=(r,a="image.png")=>{const l=R(r),s=URL.createObjectURL(l),t=document.createElement("a");t.href=s,t.download=a,document.body.appendChild(t),t.click(),setTimeout(()=>{document.body.removeChild(t),URL.revokeObjectURL(s)},100)},F=()=>{const[r,a]=m.useState(null),[l,s]=m.useState(null),[t,n]=m.useState(null),[o,c]=m.useState(!1),[d,u]=m.useState({content:"LGTM",x:.5,y:.5,fontSize:48,color:"white",fontFamily:"Arial, sans-serif"}),h=m.useCallback(i=>{if(i){const g=URL.createObjectURL(i);s(g),n(null)}else l&&URL.revokeObjectURL(l),s(null),n(null);a(i)},[l]),b=m.useCallback(i=>{u(g=>({...g,content:i})),n(null)},[]),x=m.useCallback((i,g)=>{u(N=>({...N,x:i,y:g})),n(null)},[]),f=m.useCallback(i=>{u(g=>({...g,fontSize:i})),n(null)},[]),w=m.useCallback(async()=>{if(r){c(!0);try{const i=await U(r,d);n(i)}catch(i){console.error("Failed to generate image:",i)}finally{c(!1)}}},[r,d]),v=m.useCallback(i=>{t&&k(t,i||`LGTM_${Date.now()}.png`)},[t]);return{image:r,previewUrl:l,resultUrl:t,textOptions:d,isGenerating:o,setImage:h,setTextContent:b,setTextPosition:x,setFontSize:f,generateImage:w,downloadResult:v}};function T(){const{t:r}=p(),{image:a,previewUrl:l,resultUrl:s,textOptions:t,isGenerating:n,setImage:o,setTextContent:c,setTextPosition:d,setFontSize:u,generateImage:h,downloadResult:b}=F();return e.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-8",children:[e.jsx("h1",{className:"text-center mb-8",children:r("lgtm")}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx(y,{onImageSelect:o}),a&&e.jsxs(e.Fragment,{children:[e.jsx(C,{text:t.content,onTextChange:c,posX:t.x,posY:t.y,onPositionChange:d,fontSize:t.fontSize,onFontSizeChange:u}),e.jsxs("div",{className:"flex gap-4 mt-4",children:[e.jsx("button",{onClick:h,disabled:n,className:"px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-1",children:n?"Generating...":r("generate")}),s&&e.jsx("button",{onClick:()=>b(),className:"px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex-1",children:r("download")})]})]})]}),e.jsxs("div",{className:"flex flex-col",children:[l&&e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"mb-2 font-medium",children:"Original"}),e.jsx(j,{imageUrl:l,alt:"Original"})]}),s&&e.jsxs("div",{className:"mb-6",children:[e.jsx("h3",{className:"mb-2 font-medium",children:"Result"}),e.jsx(j,{imageUrl:s,alt:"Result"})]}),!l&&e.jsx("div",{className:"flex justify-center items-center h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-md text-gray-500",children:e.jsx("p",{children:"Upload an image to get started"})})]})]})]})}export{T as default};
