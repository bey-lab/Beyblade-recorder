/* BEY LAB shared player hands. Names are referenced, never duplicated. */
(function(){
"use strict";
const KEY="bey-lab-migration-hands-v1";
const clean=x=>typeof x==="string"?x.trim().slice(0,70):"";
function read(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&typeof x==="object"&&!Array.isArray(x))return x}catch(e){}return {}}
function write(data){localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new Event("bey-hands-updated"))}
function get(player,part){const d=read()[player];return d&&Array.isArray(d[part])?[...new Set(d[part].filter(x=>typeof x==="string"))]:[]}
function has(player,part){return get(player,part).length>0}
function set(player,part,names){if(!["blade","ratchet","bit"].includes(part)||!clean(player))return;const all=read();all[player]??={};all[player][part]=[...new Set(names.map(clean).filter(Boolean))];write(all)}
function preferred(player,part,all){const hand=get(player,part);return hand.length?[...hand.filter(x=>all.includes(x)),...all.filter(x=>!hand.includes(x))]:all.slice()}
function pool(part){const values=new Set();for(const env of ["test","official"]){for(const mode of ["arena","1on1"]){try{const d=JSON.parse(localStorage.getItem("bey-lab-migration-"+(mode==="arena"?"arena-v1-":"1on1-v1-")+env));if(!d)continue;if(part==="blade")for(const x of d.blades||[])if(clean(x))values.add(clean(x));if(mode==="1on1"){for(const x of d.partOrders?.[part]||[])if(clean(x))values.add(clean(x));for(const side of ["B","X"])if(clean(d.slots?.[side]?.[part]))values.add(clean(d.slots[side][part]))}}catch(e){}}}
for(const list of Object.values(read()))for(const x of list?.[part]||[])if(clean(x))values.add(clean(x));
return [...values].sort((a,b)=>a.localeCompare(b,"ja"))}
// Shared ratchet display classification. Keep all categories visible.
function ratchetGroup(name){
 const v=clean(name).toUpperCase();
 if(/^M-?\d{2,3}$/.test(v))return "metal";
 const m=v.match(/^(\d+)-(\d{2,3})$/);
 if(m)return ["50","60","70","80"].includes(m[2])?"standard":"simple";
 return "other";
}
function ratchetHeight(name){const v=clean(name).toUpperCase(),m=v.match(/(?:-|^|^M)(\d{2,3})$/);return m?Number(m[1]):999}
function ratchetSort(a,b){return ratchetHeight(a)-ratchetHeight(b)||a.localeCompare(b,"ja",{numeric:true})}
function ratchetGroups(values){
 const groups={standard:[],simple:[],metal:[],other:[]};
 for(const value of [...new Set(values.map(clean).filter(Boolean))])groups[ratchetGroup(value)].push(value);
 for(const key of Object.keys(groups))groups[key].sort(ratchetSort);
 return groups;
}
function players(){const names=new Set(Object.keys(read()));for(const env of ["test","official"])for(const mode of ["arena","1on1"]){try{const d=JSON.parse(localStorage.getItem("bey-lab-migration-"+(mode==="arena"?"arena-v1-":"1on1-v1-")+env));for(const n of d?.players||[])if(clean(n))names.add(clean(n))}catch(e){}}
return [...names].sort((a,b)=>a.localeCompare(b,"ja"))}
const PRESET_KEY="bey-lab-migration-presets-v1";
function presetsRead(){try{const d=JSON.parse(localStorage.getItem(PRESET_KEY));return d&&typeof d==="object"&&!Array.isArray(d)?d:{}}catch(e){return {}}}
function presetsGet(player){return (presetsRead()[clean(player)]||[]).filter(x=>x&&typeof x==="object"&&clean(x.blade)).map(x=>({blade:clean(x.blade),ratchet:clean(x.ratchet),bit:clean(x.bit)}))}
function presetsSave(player,part){player=clean(player);if(!player||!clean(part?.blade))return false;const all=presetsRead(),item={blade:clean(part.blade),ratchet:clean(part.ratchet),bit:clean(part.bit)};all[player]??=[];if(!all[player].some(x=>x.blade===item.blade&&x.ratchet===item.ratchet&&x.bit===item.bit))all[player].unshift(item);localStorage.setItem(PRESET_KEY,JSON.stringify(all));window.dispatchEvent(new Event("bey-hands-updated"));return true}
function presetsRemove(player,index){const all=presetsRead();if(!Array.isArray(all[clean(player)])||index<0||index>=all[clean(player)].length)return false;all[clean(player)].splice(index,1);localStorage.setItem(PRESET_KEY,JSON.stringify(all));window.dispatchEvent(new Event("bey-hands-updated"));return true}
// Player management updates active rosters and shared libraries, never historical match snapshots.
function changePlayer(oldName,newName){
 oldName=clean(oldName);newName=clean(newName);
 if(!oldName||newName===oldName||newName&&players().includes(newName))throw Error("名前が重複しているか、変更できません。");
 if(!players().includes(oldName))throw Error("プレイヤーが見つかりません。");
 const keys=[KEY,PRESET_KEY,...["test","official"].flatMap(env=>["1on1","arena"].map(mode=>"bey-lab-migration-"+mode+"-v1-"+env))];
 const updates=new Map();
 for(const key of keys){
  const raw=localStorage.getItem(key);if(raw===null)continue;
  let data;try{data=JSON.parse(raw)}catch(e){throw Error("保存データが読み取れません: "+key)}
  if(!data||typeof data!=="object"||Array.isArray(data))continue;
  if(key===KEY||key===PRESET_KEY){
   if(Object.prototype.hasOwnProperty.call(data,oldName)){
    if(newName){data[newName]=data[oldName]}delete data[oldName];
   }
  }else{
   if(Array.isArray(data.players))data.players=[...new Set(data.players.map(x=>x===oldName?newName:x).filter(Boolean))];
   if(data.slots)for(const side of ["B","X"])if(data.slots[side]?.player===oldName){
    data.slots[side].player=newName||data.players?.[0]||"";
   }
   // Completed match history and session snapshots are deliberately untouched.
  }
  updates.set(key,JSON.stringify(data));
 }
 // Keep a player visible even if it only existed in an active roster.
 if(newName&&!updates.has(KEY)){
  const hands=read();hands[newName]??={};updates.set(KEY,JSON.stringify(hands));
 }else if(newName){
  const hands=JSON.parse(updates.get(KEY));hands[newName]??={};updates.set(KEY,JSON.stringify(hands));
 }
 const originals=new Map([...updates.keys()].map(key=>[key,localStorage.getItem(key)]));
 try{for(const [key,value] of updates)localStorage.setItem(key,value)}
 catch(e){for(const [key,raw] of originals){try{if(raw===null)localStorage.removeItem(key);else localStorage.setItem(key,raw)}catch(_){}}throw Error("保存に失敗しました。空き容量を確認してください。")}
 window.dispatchEvent(new Event("bey-hands-updated"));return true;
}
// Structural metadata is separate from owned parts and historical results.
const STRUCTURE_KEY="bey-lab-part-structure-v1";
function structures(){try{const d=JSON.parse(localStorage.getItem(STRUCTURE_KEY));return d&&typeof d==="object"&&!Array.isArray(d)?d:{}}catch(e){return {}}}
function integrated(part,name){if(!["blade","bit"].includes(part))return false;return structures()[part]?.[clean(name)]==="ratchet"}
function setIntegrated(part,name,enabled){
 if(!["blade","bit"].includes(part)||!clean(name))throw Error("対象パーツが不正です");
 const d=structures();d[part]??={};
 if(enabled)d[part][clean(name)]="ratchet";else delete d[part][clean(name)];
 localStorage.setItem(STRUCTURE_KEY,JSON.stringify(d));
 window.dispatchEvent(new Event("bey-hands-updated"));
}
function ratchetStatus(blade,ratchet,bit){
 const b=integrated("blade",blade),t=integrated("bit",bit);
 return b&&t?"conflict":b?"integrated_blade":t?"integrated_bit":clean(ratchet)?"separate":"missing";
}
window.BEY_HANDS={get,has,set,preferred,pool,players,read,presetsGet,presetsSave,presetsRemove,ratchetGroup,ratchetHeight,ratchetSort,ratchetGroups,changePlayer,integrated,setIntegrated,ratchetStatus};
})();
