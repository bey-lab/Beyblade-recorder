/* BEY LAB shared player hands. Names are referenced, never duplicated. */
(function(){
"use strict";
const KEY="bey-lab-hands-v1";
const clean=x=>typeof x==="string"?x.trim().slice(0,70):"";
function read(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&typeof x==="object"&&!Array.isArray(x))return x}catch(e){}return {}}
function write(data){localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new Event("bey-hands-updated"))}
function get(player,part){const d=read()[player];return d&&Array.isArray(d[part])?[...new Set(d[part].filter(x=>typeof x==="string"))]:[]}
function has(player,part){return get(player,part).length>0}
function set(player,part,names){if(!["blade","ratchet","bit"].includes(part)||!clean(player))return;const all=read();all[player]??={};all[player][part]=[...new Set(names.map(clean).filter(Boolean))];write(all)}
function preferred(player,part,all){const hand=get(player,part);return hand.length?[...hand.filter(x=>all.includes(x)),...all.filter(x=>!hand.includes(x))]:all.slice()}
function pool(part){const values=new Set();for(const env of ["test","official"]){for(const mode of ["arena","1on1"]){try{const d=JSON.parse(localStorage.getItem("bey-lab-"+(mode==="arena"?"arena-v1-":"1on1-v1-")+env));if(!d)continue;if(part==="blade")for(const x of d.blades||[])if(clean(x))values.add(clean(x));if(mode==="1on1"){for(const x of d.partOrders?.[part]||[])if(clean(x))values.add(clean(x));for(const side of ["B","X"])if(clean(d.slots?.[side]?.[part]))values.add(clean(d.slots[side][part]))}}catch(e){}}}
for(const list of Object.values(read()))for(const x of list?.[part]||[])if(clean(x))values.add(clean(x));
return [...values].sort((a,b)=>a.localeCompare(b,"ja"))}
function players(){const names=new Set(Object.keys(read()));for(const env of ["test","official"])for(const mode of ["arena","1on1"]){try{const d=JSON.parse(localStorage.getItem("bey-lab-"+(mode==="arena"?"arena-v1-":"1on1-v1-")+env));for(const n of d?.players||[])if(clean(n))names.add(clean(n))}catch(e){}}
return [...names].sort((a,b)=>a.localeCompare(b,"ja"))}
window.BEY_HANDS={get,has,set,preferred,pool,players,read};
})();