/* BEY LAB common battle layout and metallic flash, shared across modes.
   Moves existing DOM nodes: event listeners, IDs and data remain unchanged. */
(function(){
 "use strict";
  function makeHeader(){
  const mode=document.body.dataset.beyMode;
  if(!["arena","lab","league"].includes(mode)||document.querySelector(".bey-shared-header"))return;
  const old=document.querySelector("header");
  if(!old)return;
  const header=document.createElement("div");header.className="bey-shared-header";
  const brand=document.createElement("a");brand.className="bey-shared-brand";brand.href="./index.html?home=1";
  brand.innerHTML='<span class="bey-brand-orbit">⟳</span><span><strong>BEY LAB</strong><small>BATTLE RESEARCH SYSTEM</small></span>';
  const nav=document.createElement("nav");nav.className="bey-shared-nav";nav.setAttribute("aria-label","共通メニュー");
  const modes=[["arena","👑 勝ち抜き","./arena.html"],["lab","🔬 1on1研究","./lab.html"],["league","🏆 3on3リーグ","./league.html"]];
  for(const [id,label,href] of modes){
   const a=document.createElement("a");a.className="bey-nav-button"+(mode===id?" active":"");a.href=href;a.textContent=label;
   if(mode===id)a.setAttribute("aria-current","page");
   nav.appendChild(a);
  }
  const arenaEdit=mode==="arena"?old.querySelector('[data-action="edit"]'):null;
  const arenaHistory=mode==="arena"?old.querySelector('[data-action="history"]'):null;
  if(arenaEdit){arenaEdit.classList.add("bey-nav-button");nav.appendChild(arenaEdit)}
  else{const a=document.createElement("a");a.className="bey-nav-button";a.href="./data.html";a.textContent="⚙ 登録・データ管理";nav.appendChild(a)}
  if(arenaHistory){arenaHistory.classList.add("bey-nav-button");nav.appendChild(arenaHistory)}
  else{const a=document.createElement("a");a.className="bey-nav-button";a.href="./records.html";a.textContent="📖 記録・履歴";nav.appendChild(a)}
  const home=document.createElement("a");home.className="bey-nav-button bey-home-button";home.href="./index.html?home=1";home.textContent="⌂ ホームへ戻る";nav.appendChild(home);
  const env=old.querySelector(".env-indicator")||document.getElementById("environment");
  if(env){env.classList.add("bey-shared-env");nav.prepend(env)}
  header.append(brand,nav);
  old.parentNode.insertBefore(header,old);
  old.classList.add("bey-original-header-hidden");
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
