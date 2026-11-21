/* Shared stadium selection for BEY LAB battle modes.
   The selection is a UI preference, not a change to historical battle data. */
(function(){
 "use strict";
 const OPTIONS=[["normal","ノーマル"],["extreme","エクストリーム"],["wide","ワイド"]];
 const allowed=new Set(OPTIONS.map(x=>x[0]));
 let env="test";
 try{env=localStorage.getItem("bey-lab-environment-v1")==="official"?"official":"test"}catch(e){}
 const KEY="bey-lab-stadium-selection-v1-"+env;
 let selected=null;
 try{const v=localStorage.getItem(KEY);if(allowed.has(v))selected=v}catch(e){}
 const get=()=>selected;
 function mount(){
  const nav=document.querySelector(".bey-seven-nav");
  if(!nav||document.getElementById("beyStadiumPicker"))return;
  const style=document.createElement("style");
  style.textContent='.bey-stadium-picker{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:10px 0 15px;padding:10px 12px;border:1px solid #465a72;border-radius:11px;background:#15253a;color:#ebf1fb;font:700 12px/1.4 system-ui,sans-serif}.bey-stadium-picker .bey-stadium-label{color:#b6c8de;white-space:nowrap}.bey-stadium-buttons{display:flex;flex-wrap:wrap;gap:6px}.bey-stadium-buttons button{font:800 12px/1.3 system-ui,sans-serif;padding:8px 10px;min-height:36px;border-radius:8px;border:1px solid #607791;background:#20354e;color:#f4f8ff;cursor:pointer}.bey-stadium-buttons button[aria-pressed="true"]{border-color:#efce82;background:#51452d;color:#ffedc4;box-shadow:0 0 0 1px #ddbb6c}.bey-stadium-hint{font-size:11px;color:#aec2d8;font-weight:500}@media(max-width:430px){.bey-stadium-picker{gap:7px;padding:9px}.bey-stadium-buttons button{padding:7px 8px;font-size:11px}}';
  document.head.appendChild(style);
  const box=document.createElement("section");
  box.id="beyStadiumPicker";
  box.className="bey-stadium-picker";
  box.setAttribute("aria-label","使用スタジアムの選択");
  const label=document.createElement("span");
  label.className="bey-stadium-label";
  label.textContent="🏟️ 使用スタジアム";
  const buttons=document.createElement("div");
  buttons.className="bey-stadium-buttons";
  for(const [id,name] of OPTIONS){
   const b=document.createElement("button");
   b.type="button";b.textContent=name;b.dataset.stadium=id;
   b.addEventListener("click",()=>{
    try{localStorage.setItem(KEY,id);selected=id;update()}catch(e){alert("スタジアム設定を保存できませんでした。")}
   });
   buttons.appendChild(b);
  }
  const hint=document.createElement("span");hint.className="bey-stadium-hint";hint.id="beyStadiumHint";
  box.append(label,buttons,hint);
  nav.insertAdjacentElement("afterend",box);
  function update(){
   for(const b of buttons.querySelectorAll("button"))b.setAttribute("aria-pressed",String(b.dataset.stadium===selected));
   hint.textContent=selected?"変更するまでこの設定で記録":"最初に選択してください（未選択の記録は不明扱い）";
  }
  update();
 }
 window.BEY_STADIUM={get};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
 else mount();
})();