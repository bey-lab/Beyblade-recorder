/* BEY LAB common battle layout and metallic flash, shared across modes.
   Moves existing DOM nodes: event listeners, IDs and data remain unchanged. */
(function(){
 "use strict";
 function arrange(){
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
