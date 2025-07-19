const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/mermaid.core-BJgaMPUD.js","assets/index-DhFFnUky.js","assets/index-DXcynv11.css"])))=>i.map(i=>d[i]);
import{R as a,b as _,r as n,_ as N,P as k}from"./index-DhFFnUky.js";import{u as J}from"./usePerformanceMonitor-BteRx6Vv.js";const z=()=>{typeof window<"u"&&"requestIdleCallback"in window&&window.requestIdleCallback(()=>{N(()=>import("./mermaid.core-BJgaMPUD.js").then(i=>i.b6),__vite__mapDeps([0,1,2])).catch(()=>{})})},V=async()=>{try{return(await N(()=>import("./mermaid.core-BJgaMPUD.js").then(c=>c.b6),__vite__mapDeps([0,1,2]))).default}catch(i){throw console.error("Failed to load Mermaid:",i),i}},q=()=>a.createElement("div",{className:"mermaid-loading"},a.createElement("div",{className:"mermaid-loading-container"},a.createElement("div",{className:"mermaid-loading-spinner"}),a.createElement("div",{className:"mermaid-loading-skeleton"},a.createElement("div",{className:"skeleton-header"}),a.createElement("div",{className:"skeleton-diagram"},a.createElement("div",{className:"skeleton-node"}),a.createElement("div",{className:"skeleton-line"}),a.createElement("div",{className:"skeleton-node"}),a.createElement("div",{className:"skeleton-line"}),a.createElement("div",{className:"skeleton-node"}))),a.createElement("p",null,"Loading diagram renderer..."))),w=()=>{const{theme:i}=_(),[c,S]=n.useState(`sequenceDiagram
    participant User
    participant Renderer as React UI (Renderer)
    participant IPCR as IPC Renderer
    participant IPCM as IPC Main
    participant Main as Main Process
    participant CP as Child Process
    participant Store as Redux Store

    User->>Renderer: Click "Create Address"
    Renderer->>IPCR: invoke('execute-cli', 'dwallet client new-address --json')
    IPCR->>IPCM: handle('execute-cli')
    IPCM->>Main: Execute command
    Main->>CP: exec('dwallet client new-address --json')
    CP->>Main: stdout (JSON: address, keypair), stderr, exitCode
    Main->>Main: Parse and validate JSON
    alt Valid JSON
        Main->>IPCM: Return parsed JSON
        IPCM->>IPCR: Resolve promise
        IPCR->>Renderer: Receive JSON
        Renderer->>Store: Dispatch updateAddresses(json)
        Store->>Renderer: Update state
        Renderer->>User: Display address/keypair in table
        Renderer->>IPCR: invoke('execute-cli', 'dwallet client gas --json')
        IPCR->>IPCM: handle('execute-cli')
        IPCM->>Main: Execute command
        Main->>CP: exec('dwallet client gas --json')
        CP->>Main: stdout (JSON: gas objects), stderr, exitCode
        Main->>Main: Parse and validate JSON
        alt Valid JSON
            Main->>IPCM: Return parsed JSON
            IPCM->>IPCR: Resolve promise
            IPCR->>Renderer: Receive JSON
            Renderer->>Store: Dispatch updateBalances(json)
            Store->>Renderer: Update state
            Renderer->>User: Display balance in table
        else Error
            Main->>IPCM: Return error
            IPCM->>IPCR: Reject promise
            IPCR->>Renderer: Show error
            Renderer->>User: Display error message
        end
    else Error
        Main->>IPCM: Return error
        IPCM->>IPCR: Reject promise
        IPCR->>Renderer: Show error
        Renderer->>User: Display error message
    end
    note right of Renderer: 'dwallet client objects' follows similar flow`),[g,M]=n.useState(""),[s,T]=n.useState(null),[l,E]=n.useState(!1),[p,u]=n.useState(null),[d,G]=n.useState(0),f=n.useRef(null),C=n.useRef(null),h=J("Mermaid"),[L,y]=n.useState(!1),e=i==="dark";n.useEffect(()=>{const t=new IntersectionObserver(r=>{r.forEach(o=>{o.isIntersecting&&o.intersectionRatio>.1&&z()})},{threshold:.1,rootMargin:"50px"});return C.current&&t.observe(C.current),()=>t.disconnect()},[]);const B=n.useMemo(()=>({theme:"base",fontFamily:"Inter Tight, sans-serif",fontSize:"16px",textColor:e?"#fafafa":"#0a0d1a",themeVariables:{fontFamily:"Inter Tight, sans-serif",fontSize:"16px",textColor:e?"#fafafa":"#0a0d1a",darkMode:e,background:e?"#0c0f1d":"#f7f7f7",primaryColor:e?"#1a1d2e":"#eafcfa",primaryTextColor:e?"#fafafa":"#0c0f1d",primaryBorderColor:e?"#37c5b3":"#97f0e5",secondaryColor:e?"#613dff":"#f6ce9e",secondaryTextColor:e?"#fafafa":"#0c0f1d",secondaryBorderColor:e?"#97f0e5":"#f97946",tertiaryColor:e?"#f946ac":"#8cf28a",tertiaryTextColor:e?"#fafafa":"#0c0f1d",tertiaryBorderColor:e?"#f759b7":"#6bcc69",lineColor:e?"#f7f7f7":"#37c5b3",arrowheadColor:e?"#f7f7f7":"#37c5b3",edgeColor:e?"#f7f7f7":"#37c5b3",defaultLinkColor:e?"#f7f7f7":"#37c5b3",clusterBkg:e?"#252842":"#e9ccff",clusterBorder:e?"#a56ff1":"#c584f6",noteBkgColor:"#f9d546",noteTextColor:"#0c0f1d",noteBorderColor:"#f97946",errorBkgColor:e?"#b91c1c":"#f87171",errorTextColor:e?"#f87171":"#b91c1c",nodeBorder:e?"#37c5b3":"#97f0e5",nodeTextColor:e?"#fafafa":"#0c0f1d",edgeLabelBackground:e?"#1a1d2e":"#eafcfa",titleColor:e?"#fafafa":"#0a0d1a",actorBkg:e?"#0c0f1d":"#f7f7f7",actorBorder:e?"#37c5b3":"#97f0e5",actorTextColor:e?"#fafafa":"#0c0f1d",actorLineColor:e?"#f7f7f7":"#37c5b3",signalColor:e?"#f7f7f7":"#37c5b3",signalTextColor:e?"#fafafa":"#0c0f1d",labelBoxBkgColor:e?"#1a1d2e":"#eafcfa",labelBoxBorderColor:e?"#37c5b3":"#97f0e5",labelTextColor:e?"#fafafa":"#0c0f1d",loopTextColor:e?"#fafafa":"#0c0f1d",activationBorderColor:e?"#97f0e5":"#37c5b3",activationBkgColor:e?"#252842":"#f0fffe",sequenceNumberColor:e?"#fafafa":"#0c0f1d",section0:e?"#1a1d2e":"#eafcfa",section1:e?"#613dff":"#f6ce9e",section2:e?"#f946ac":"#8cf28a",section3:e?"#37c5b3":"#fce4a6",git0:e?"#1a1d2e":"#eafcfa",git1:e?"#613dff":"#f6ce9e",git2:e?"#f946ac":"#8cf28a",git3:e?"#37c5b3":"#fce4a6",git4:e?"#f759b7":"#f0c5d8",git5:e?"#97f0e5":"#d4b5f7",git6:e?"#f97946":"#b8e6d3",git7:e?"#6bcc69":"#ffd5a6",pieTitleTextSize:"20px",pieTitleTextColor:e?"#fafafa":"#0a0d1a",pieOuterStrokeWidth:"2px",pieStrokeColor:e?"#37c5b3":"#0a0d1a",pieOpacity:"0.9",fillType0:e?"#1a1d2e":"#eafcfa",fillType1:e?"#613dff":"#f6ce9e",fillType2:e?"#f946ac":"#8cf28a",fillType3:e?"#37c5b3":"#fce4a6",fillType4:e?"#f759b7":"#f0c5d8",fillType5:e?"#97f0e5":"#d4b5f7",fillType6:e?"#f97946":"#b8e6d3",fillType7:e?"#6bcc69":"#ffd5a6"}}),[e]);n.useEffect(()=>{!s&&!L&&(async()=>{try{if(y(!0),!s){const r=await V();T(r),E(!0)}}catch(r){console.error("Failed to load Mermaid library:",r),u(r),E(!1)}finally{y(!1)}})()},[]),n.useEffect(()=>{if(!s||!l||!c)return;(async()=>{try{f.current&&(f.current.innerHTML=""),s.initialize(B);const{svg:r}=await s.render("mermaid-graph",c);M(r),u(null),h.record("render")}catch(r){M(`<p>Error rendering diagram: ${r.message}</p>`),u(r),h.record("error")}})()},[c,i,l]);const U=()=>{if(!g)return;const t=new Blob([g],{type:"image/svg+xml"}),r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download="diagram.svg",o.click(),URL.revokeObjectURL(r)},O=()=>{var r;const t=(r=f.current)==null?void 0:r.querySelector("svg");if(t)try{const o=document.createElement("canvas"),P=t.getBBox();o.width=P.width*2,o.height=P.height*2;const b=o.getContext("2d");if(!b)return;b.scale(2,2);const m=new Image,j=new XMLSerializer().serializeToString(t),D=new Blob([j],{type:"image/svg+xml;charset=utf-8"}),R=URL.createObjectURL(D);m.onload=()=>{b.drawImage(m,0,0),o.toBlob(x=>{if(x){const I=URL.createObjectURL(x),v=document.createElement("a");v.href=I,v.download="diagram.png",v.click(),URL.revokeObjectURL(I)}},"image/png"),URL.revokeObjectURL(R)},m.onerror=()=>{URL.revokeObjectURL(R)},m.src=R}catch(o){console.error("Error generating PNG:",o)}};return a.createElement("section",{className:"section",ref:C},a.createElement("div",{className:"container"},a.createElement("h2",{className:"section-title"},"Mermaid.js"),p&&a.createElement("div",{className:"alert alert-danger",role:"alert"},"Error: ",p.message),!l&&!p&&a.createElement(q,null),d>0&&d<100&&a.createElement("div",{className:"loading-progress"},a.createElement("div",{className:"progress-bar",style:{width:`${d}%`}}),a.createElement("span",{className:"progress-text"},d,"% loaded")),l&&a.createElement("div",{className:"mermaid-container"},a.createElement("div",{className:"mermaid-editor-diagram-wrapper"},a.createElement("div",{className:"mermaid-editor"},a.createElement("textarea",{value:c,onChange:t=>S(t.target.value),placeholder:"Enter your Mermaid syntax here..."})),a.createElement("div",{className:"mermaid-diagram",ref:f,dangerouslySetInnerHTML:{__html:g}})),a.createElement("div",{className:"mermaid-buttons"},a.createElement("button",{className:"btn btn-primary",onClick:U},"Download SVG"),a.createElement("button",{className:"btn btn-secondary",onClick:O},"Download PNG")))))};w.propTypes={diagramDefinition:k.string,theme:k.oneOf(["light","dark"])};const H=a.memo(w);export{H as Mermaid};
