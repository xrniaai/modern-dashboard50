import { useEffect } from "react";

export function AIAssistant() {
  useEffect(() => {
    // Load Chatbase script
    if (!document.getElementById("MYvrxJvDXap1-jKpAgmy-")) {
      const script = document.createElement("script");
      script.innerHTML = `
        (function(){
          if(!window.chatbase||window.chatbase("getState")!=="initialized"){
            window.chatbase=(...arguments)=>{
              if(!window.chatbase.q){window.chatbase.q=[]}
              window.chatbase.q.push(arguments)
            };
            window.chatbase=new Proxy(window.chatbase,{
              get(target,prop){
                if(prop==="q"){return target.q}
                return(...args)=>target(prop,...args)
              }
            })
          }
          const onLoad=function(){
            const script=document.createElement("script");
            script.src="https://www.chatbase.co/embed.min.js";
            script.id="MYvrxJvDXap1-jKpAgmy-";
            script.domain="www.chatbase.co";
            document.body.appendChild(script);
          };
          if(document.readyState==="complete"){
            onLoad();
          }else{
            window.addEventListener("load",onLoad);
          }
        })();
      `;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}