/* BEY LAB common battle layout and metallic flash, shared across modes.
   Moves existing DOM nodes: event listeners, IDs and data remain unchanged. */
(function(){
 "use strict";
  function makeHeader(){
  const mode=document.body.dataset.beyMode;
  if(!["arena","lab","league","home","records","data","hands"].includes(mode)||document.querySelector(".bey-shared-header"))return;
  if(mode==="home"&&document.body.classList.contains("legacy"))return;
  const old=mode==="home"?document.querySelector("#home > header"):document.querySelector("header");
  if(!old&&mode!=="data")return;
  const header=document.createElement("div");header.className="bey-shared-header";
  const brand=document.createElement("a");brand.className="bey-shared-brand";brand.href="./index.html?home=1";
  brand.innerHTML='<span class="bey-brand-orbit">⟳</span><span><strong>BEY LAB</strong><small>BATTLE RESEARCH SYSTEM</small></span>';
  const nav=document.querySelector(".bey-seven-nav")||document.createElement("nav");
  if(!nav.classList.contains("bey-seven-nav")){nav.className="bey-shared-nav";nav.setAttribute("aria-label","共通メニュー")}
  const arenaEdit=mode==="arena"?old?.querySelector('[data-action="edit"]'):null;
  const arenaHistory=mode==="arena"?old?.querySelector('[data-action="history"]'):null;
  if(arenaEdit){arenaEdit.classList.add("bey-nav-button");nav.appendChild(arenaEdit)}
  if(arenaHistory){arenaHistory.classList.add("bey-nav-button");nav.appendChild(arenaHistory)}
  const env=old?.querySelector(".env-indicator")||document.getElementById("environment");
  if(env){
   env.classList.add("bey-shared-env");nav.prepend(env);
   if(mode==="lab"){
    const official=window.BEY_ENV==="official";
    env.textContent=official?"🏆 本番データ":"🧪 テストデータ";
    env.classList.toggle("official",official);
   }
  }
  if(mode==="data"){
   const badge=document.createElement("span");badge.className="bey-shared-env";
   const official=localStorage.getItem("bey-lab-environment-v1")==="official";
   badge.textContent=official?"🏆 現在：本番":"🧪 現在：テスト";nav.prepend(badge);
  }
  if(mode==="lab"){
   const switcher=old?.querySelector(".m17-env-control");
   if(switcher)nav.prepend(switcher);
  }
  if(mode==="home"){
   const homeEnv=old.querySelector(".home-env");
   if(homeEnv){homeEnv.classList.add("bey-home-env-shared");nav.prepend(homeEnv)}
  }
  nav.classList.add("bey-seven-active");
  header.append(brand,nav);
  if(old){old.parentNode.insertBefore(header,old);old.classList.add("bey-original-header-hidden")}
  else{const wrap=document.querySelector("main")||document.body;wrap.insertBefore(header,wrap.firstChild)}
 }
 function arrange(){
  makeHeader();
  const mode=document.body.dataset.beyMode;
  if(mode==="lab"){
   const board=document.querySelector(".duel-score"),versus=document.querySelector(".versus");
   if(!board||!versus||document.querySelector(".bey-universal-stage"))return;
   const sides=versus.querySelectorAll(":scope > .fighter");
   if(sides.length!==2)return;
   const stage=document.createElement("div");stage.className="bey-universal-stage";
   board.parentNode.insertBefore(stage,board);
   sides[0].classList.add("bey-side-b");sides[1].classList.add("bey-side-x");
   board.classList.add("bey-board");stage.append(sides[0],board,sides[1]);
   versus.remove();
  }else if(mode==="league"){
   const sides=document.getElementById("sides"),score=document.querySelector(".scoreboard"),actions=document.querySelector(".score-actions");
   if(!sides||!score||!actions||document.querySelector(".bey-universal-stage"))return;
   const champion=document.getElementById("champion"),buttons=document.getElementById("undo")?.parentElement;
   const stage=document.createElement("div");stage.className="bey-universal-stage";
   sides.parentNode.insertBefore(stage,sides);
   const board=document.createElement("div");board.className="bey-board";
   sides.classList.add("bey-league-sides");
   stage.append(sides,board);
   board.append(score,actions);
   if(champion)board.appendChild(champion);
   if(buttons){buttons.classList.add("bey-board-actions");board.appendChild(buttons)}

  }
 }
 function flash(el){
  if(!el)return;
  el.classList.remove("bey-metal-hit");void el.offsetWidth;el.classList.add("bey-metal-hit");
  setTimeout(()=>el.classList.remove("bey-metal-hit"),650);
 }
 document.addEventListener("click",e=>{
  const mode=document.body.dataset.beyMode;
  if(mode==="league"){
   const btn=e.target.closest("[data-score]");
   if(btn)flash(btn);
  }else if(mode==="lab"){
   const btn=e.target.closest('[data-action="quick-part"],[data-action="finish"]');
   if(btn)flash(btn);
  }
 });
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",arrange,{once:true});
 else arrange();
 window.BEY_UI={flash};
})();
