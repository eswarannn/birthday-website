const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
let current=1, musicStarted=false;
const scenes=[...document.querySelectorAll(".scene")];
// PASSWORD: Change the password in script.js
const SECRET_PASSWORD="muneefa";
// HINT: Change the hint text here
const PASSWORD_HINT="The password is name of my moon 🌙";

function showScene(n){
  const target=document.querySelector(n==="final"?"#final":`#scene${n}`);
  scenes.forEach(s=>s.classList.remove("active"));
  setTimeout(()=>target.classList.add("active"),40);
  if(n===2)setTimeout(openAncientPaper,180);
  current=n;
  window.scrollTo({top:0});
}
function startMusic(){
  if(musicStarted)return;
  musicStarted=true;
  const m=$("#music"); m.volume=.35; m.play().then(()=>$("#musicToggle").textContent="🎵 ON").catch(()=>{});
}
function heartBurst(el){
  const r=el.getBoundingClientRect();
  for(let i=0;i<16;i++){
    const h=document.createElement("span"); h.textContent="♥"; h.style.position="fixed"; h.style.left=r.left+r.width/2+"px"; h.style.top=r.top+r.height/2+"px"; h.style.zIndex=100; h.style.pointerEvents="none"; h.style.color=["#ff82b7","#ffb2d0","#c5b4ff"][i%3]; h.style.fontSize=(10+Math.random()*16)+"px";
    document.body.appendChild(h);
    const x=(Math.random()-.5)*220, y=-50-Math.random()*180;
    h.animate([{transform:"translate(0,0) scale(.5)",opacity:1},{transform:`translate(${x}px,${y}px) scale(1.2)`,opacity:0}],{duration:900+Math.random()*500,easing:"cubic-bezier(.2,.8,.2,1)"}).onfinish=()=>h.remove();
  }
}
function moveButton(btn, container){
  const c=container.getBoundingClientRect(), b=btn.getBoundingClientRect();
  const x=Math.max(0,Math.random()*(c.width-b.width)), y=Math.max(0,Math.random()*(Math.max(60,c.height-b.height)));
  btn.style.position="absolute"; btn.style.left=x+"px"; btn.style.top=y+"px";
}
function setupRunaway(btn,msgs,hint){
  let count=0, parent=btn.parentElement; parent.style.position="relative";
  const evade=()=>{
    count++; moveButton(btn,parent);
    if(msgs[count-1]) hint.textContent=msgs[count-1];
    if(count>=4){btn.textContent=msgs[msgs.length-1]||"YES ❤️"; btn.classList.remove("runaway"); btn.style.position="relative"; btn.style.left=""; btn.style.top=""; btn.onclick=()=>{};}
  };
  btn.addEventListener("mouseenter",evade); btn.addEventListener("touchstart",e=>{if(btn.classList.contains("runaway")){e.preventDefault();evade();}});
}
function dropHearts(){
  const transition=$("#royalTransition"), container=$("#fallingHearts"), treeLeaves=$("#treeLeaves");
  if(!transition||!container||!treeLeaves)return;
  [...treeLeaves.querySelectorAll(".tree-leaf")].forEach((leaf,index)=>{
    const rect=leaf.getBoundingClientRect(), parentRect=transition.getBoundingClientRect();
    leaf.classList.remove("tree-leaf");leaf.classList.add("detached-leaf");leaf.style.left=`${rect.left-parentRect.left}px`;leaf.style.top=`${rect.top-parentRect.top}px`;leaf.style.setProperty("--wind-x",`${(Math.random()-.5)*260}px`);leaf.style.setProperty("--fall-rotation",`${(Math.random()-.5)*720}deg`);leaf.style.setProperty("--fall-scale",`${.7+Math.random()*.7}`);leaf.style.setProperty("--fall-duration",`${3.8+Math.random()*2.6}s`);leaf.style.setProperty("--fall-delay",`${index*.035}s`);container.appendChild(leaf);
  });
}
function createTreeLeaves(){
  const treeLeaves=$("#treeLeaves");
  if(!treeLeaves||treeLeaves.children.length)return;
  for(let i=0;i<96;i++){
    const leaf=document.createElement("img");leaf.className="tree-leaf";leaf.src=`assets/photos/${i%5===0?"pink.png":"brown.png"}`;leaf.alt="";leaf.style.left=`${12+Math.random()*76}%`;leaf.style.top=`${5+Math.random()*82}%`;leaf.style.setProperty("--leaf-rotation",`${-35+Math.random()*70}deg`);leaf.style.animationDelay=`-${Math.random()*3}s`;treeLeaves.appendChild(leaf);
  }
}
createTreeLeaves();
function shakeTree(){
  $("#royalTransition").classList.add("tree-hit");
  setTimeout(()=>$("#royalTransition").classList.remove("tree-hit"),900);
}
function shootAngelArrow(){
  const transition=$("#royalTransition");
  transition.classList.add("arrow-fired");
  setTimeout(shakeTree,3800);
  setTimeout(dropHearts,4200);
}
function startScene02Transition(){
  const scene=$("#scene1");
  scene.classList.add("transitioning");
  setTimeout(shootAngelArrow,350);
  setTimeout(()=>{
    scene.classList.remove("transitioning","zooming");
    showScene(2);
  },11200);
}
function openAncientPaper(){
  const paper=$("#ancientPaper");
  paper.classList.remove("opened","writing","complete");
  void paper.offsetWidth;
  paper.classList.add("opened");
  setTimeout(startWritingAnimation,1900);
}
function startWritingAnimation(){
  const paper=$("#ancientPaper"), blocks=[...document.querySelectorAll("#letterContent .writing-block")];
  paper.classList.add("writing");
  let index=0;
  const writeNextLine=()=>{
    const block=blocks[index];
    if(!block){returnFeatherToInk();return}
    block.textContent="";block.classList.add("written","active-writing");
    const text=[...block.dataset.writing];let character=0;
    const writeCharacter=()=>{
      if(character<text.length){block.textContent+=text[character++];setQuillToLine(block);setTimeout(writeCharacter,Math.max(12,34-text.length/18));return}
      block.classList.remove("active-writing");index++;setTimeout(writeNextLine,420);
    };
    writeCharacter();
  };
  writeNextLine();
}
function setQuillToLine(block){
  const paper=$("#ancientPaper"), quill=$("#quill"), rect=block.getBoundingClientRect(), paperRect=paper.getBoundingClientRect();
  quill.style.setProperty("--write-x",`${Math.min(92,Math.max(8,((rect.left+rect.width*.98-paperRect.left)/paperRect.width)*100))}%`);
  quill.style.setProperty("--write-y",`${Math.min(92,Math.max(8,((rect.top+rect.height*.68-paperRect.top)/paperRect.height)*100))}%`);
  quill.classList.add("tracking-line");
}
function returnFeatherToInk(){
  $("#ancientPaper").classList.add("complete");
  const bottle=$("#inkBottle");
  $("#quill").classList.remove("tracking-line");
  bottle.animate([{filter:"brightness(1)"},{filter:"brightness(1.8)"},{filter:"brightness(1)"}],{duration:900,easing:"ease-out"});
  setTimeout(()=>$("#memoryQuestion").classList.remove("hidden"),2600);
}
let wrongAttempts=0;
const wrongMessages=["Hmm... that's not it 👀","Try again, moon 🌙","You know this one... 🥺","Think about what I call you. 🌙"];
const passwordInput=$("#passwordInput"), passwordField=$(".password-field"), passwordMessage=$("#passwordMessage"), lockIcon=$("#lockIcon"), secretCard=$("#secretCard");
const portalTitle=$("#portalTitle"), titleText="The day my moon came into this world. ";
portalTitle.innerHTML="";
const titleNode=document.createTextNode(""); portalTitle.appendChild(titleNode);
[...titleText].forEach((char,index)=>setTimeout(()=>{titleNode.textContent+=char},2700+index*48));
setTimeout(()=>{const moon=document.createElement("span");moon.className="moon-icon";moon.textContent="🌙";portalTitle.appendChild(moon)},2700+titleText.length*48);
$("#passwordForm").onsubmit=e=>{
  e.preventDefault();
  if(passwordInput.value.trim().toLowerCase()===SECRET_PASSWORD.toLowerCase()){
    passwordField.classList.remove("error");passwordField.classList.add("success");lockIcon.textContent="🔓";passwordMessage.textContent="I knew you'd remember. ❤️";passwordMessage.className="password-message success-message";heartBurst(secretCard);startMusic();$("#scene1").classList.add("instruction-mode");$("#instructionScreen").setAttribute("aria-hidden","false");
    return;
  }
  wrongAttempts++;passwordField.classList.remove("error");void passwordField.offsetWidth;passwordField.classList.add("error");passwordMessage.textContent=wrongMessages[Math.min(wrongAttempts-1,wrongMessages.length-1)];passwordInput.value="";passwordInput.focus();
};
$("#togglePassword").onclick=()=>{const visible=passwordInput.type==="text";passwordInput.type=visible?"password":"text";$("#togglePassword").classList.toggle("toggled",!visible);$("#togglePassword").setAttribute("aria-label",visible?"Show password":"Hide password")};
$("#hintTrigger").onclick=()=>{$("#hintText").textContent="";$("#hintBubble").classList.remove("hidden");$("#hintTrigger").classList.add("hidden");[...PASSWORD_HINT].forEach((char,i)=>setTimeout(()=>$("#hintText").textContent+=char,i*28))};
$("#hideHint").onclick=()=>{$("#hintBubble").classList.add("hidden");$("#hintTrigger").classList.remove("hidden")};
secretCard.addEventListener("pointermove",e=>{const r=secretCard.getBoundingClientRect();secretCard.style.setProperty("--mx",`${((e.clientX-r.left)/r.width)*100}%`);secretCard.style.setProperty("--my",`${((e.clientY-r.top)/r.height)*100}%`);secretCard.classList.add("near")});
secretCard.addEventListener("pointerleave",()=>secretCard.classList.remove("near"));
$("#readyStory").onclick=()=>{const screen=$("#instructionScreen");screen.classList.add("leaving");heartBurst($("#readyStory"));setTimeout(()=>{screen.setAttribute("aria-hidden","true");$("#scene1").classList.remove("instruction-mode");startScene02Transition()},950)};
$("#memoriesBtn").onclick=()=>showScene(4);
const noMemory=$("#noMemory"), memoryHint=$("#memoryHint"), memoryQuestion=$("#memoryQuestion");
if(noMemory){
  let noAttempts=0;
  const escapeMemory=event=>{
    event.preventDefault();noAttempts++;
    const box=memoryQuestion.getBoundingClientRect(), button=noMemory.getBoundingClientRect();
    const maxX=Math.max(0,box.width-button.width-8), maxY=Math.max(0,box.height-button.height-8);
    noMemory.style.left=Math.round(Math.random()*maxX)+"px";noMemory.style.top=Math.round(Math.random()*maxY)+"px";noMemory.classList.add("escaping");
    memoryHint.textContent=["Nice try 👀","Nope... 😌","You can't escape this one 😂","The memories are waiting ❤️"][Math.min(noAttempts-1,3)];
    setTimeout(()=>noMemory.classList.remove("escaping"),300);
  };
  ["pointerdown","touchstart","click"].forEach(type=>noMemory.addEventListener(type,escapeMemory,{passive:false}));
}
$("#yesMemory").onclick=()=>{heartBurst($("#yesMemory"));memoryQuestion.classList.add("question-opening");setTimeout(()=>showScene(3),1100)};

function typeMemoryNote(note){
  note.classList.add("note-revealed");
}
function openMemory(photo){
  const piece=photo.closest(".memory-piece");
  if(piece.classList.contains("opened"))return;
  piece.classList.add("opened");
  piece.querySelectorAll(".scrap-photo").forEach(item=>item.setAttribute("aria-expanded","true"));
  heartBurst(photo);
  typeMemoryNote(piece.querySelector(".memory-note"));
}
function initMemoryPage(){
  $$(".memory-piece .scrap-photo").forEach(photo=>photo.addEventListener("click",()=>openMemory(photo)));
  $("#openLastMemory").onclick=()=>{
    const envelope=$("#lastMemory"), scrapbook=$("#scene3");envelope.classList.add("opening");scrapbook.classList.add("deep-transition");heartBurst(envelope);
    setTimeout(()=>{showScene(4);initPage4();},1500);
  };
}
initMemoryPage();

function initPage4(){
  const scene=$("#scene4"), photo=$("#page4Photo"), placeholder=$("#page4Placeholder"), memory=$("#page4Memory");
  if(!scene||scene.dataset.ready)return;
  scene.dataset.ready="true";
  photo.onload=()=>{placeholder.classList.add("hidden");photo.classList.add("loaded")};
  photo.onerror=()=>{photo.classList.add("hidden");placeholder.classList.remove("hidden")};
  if(photo.complete){if(photo.naturalWidth)photo.onload();else photo.onerror()}
  const openPage4Photo=()=>{memory.classList.add("opened");heartBurst(photo.classList.contains("hidden")?placeholder:photo)};
  photo.onclick=openPage4Photo;
  placeholder.onclick=openPage4Photo;
  photo.parentElement.addEventListener("pointermove",event=>{const rect=photo.parentElement.getBoundingClientRect();memory.style.setProperty("--photo-x",`${((event.clientX-rect.left)/rect.width-0.5)*10}px`);memory.style.setProperty("--photo-y",`${((event.clientY-rect.top)/rect.height-0.5)*10}px`)});
  photo.parentElement.addEventListener("pointerleave",()=>{memory.style.setProperty("--photo-x","0px");memory.style.setProperty("--photo-y","0px")});
}
initPage4();

const photoData={
  1:["MEMORY 01","A moment worth keeping...","assets/photos/IMG-20260817-WA0033.jpg"],
  2:["MEMORY 02","A moment worth keeping...","assets/photos/IMG_1565 (1).HEIC"],
  3:["MEMORY 03","A moment worth keeping...","assets/photos/IMG_1566 (1).HEIC"],
  4:["MEMORY 04","A moment worth keeping...","assets/photos/IMG_1569 (1).HEIC"],
  5:["MEMORY 05","A moment worth keeping...","assets/photos/IMG_1583 (1).HEIC"]
};
$$(".photo-btn").forEach(b=>b.onclick=()=>{
  const d=photoData[b.dataset.photo];$("#modalDate").textContent=d[0];$("#modalTitle").textContent=d[1];$("#modalMemory").textContent="A memory from our little universe.";$("#modalPhoto").src=d[2];$("#photoModal").classList.remove("hidden");
});
$("#modalClose").onclick=()=>$("#photoModal").classList.add("hidden");
$("#photoModal").onclick=e=>{if(e.target.id==="photoModal")$("#photoModal").classList.add("hidden")};

const finalLetterMessage=`A Little Message For You 🌙❤️

Muneefa, if you have reached this page, it means you have walked through all these little memories with me. ❤️

From the first simple moments to all the memories we have created, every little thing has become a part of a story that I will always remember.

I don't know what the future has waiting for us, but I'm really glad that our paths crossed. If we get the chance, I hope we get to create many more memories together.

So this isn't really the end of this little birthday world...

It's just one more memory for us to keep. 🌙✨

Happy Birthday once again, Muneefa. ❤️

— Eswaran`;
const whatsappPhone="917639240479";
function getWhatsAppUrl(){
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`;
}
function getWhatsAppMessage(){
  const reply=$("#replyMessage")?.value.trim();
  return reply?`${finalLetterMessage}\n\nHer message:\n${reply}`:finalLetterMessage;
}
function openWhatsApp(){window.location.href=getWhatsAppUrl()}
function initPage5(){
  const send=$("#sendLetter");
  if(!send||send.dataset.ready)return;
  send.dataset.ready="true";
  send.onclick=activateSendAnimation;
  const openButton=$("#openWhatsApp"), copyButton=$("#copyMessage");
  if(openButton)openButton.onclick=openWhatsApp;
  if(copyButton)copyButton.onclick=async()=>{try{await navigator.clipboard.writeText(getWhatsAppMessage());$("#deliveryStatus").textContent="Your message is copied. ❤️"}catch(error){$("#deliveryStatus").textContent="Select and copy your letter from here. ❤️"}};
}
function activateSendAnimation(){
  const scene=$("#scene5"), letter=$("#deliveryLetter"), overlay=$("#flightOverlay"), status=$("#deliveryStatus");
  if(scene.classList.contains("launching"))return;
  scene.classList.add("launching");letter.classList.add("folding");heartBurst($("#sendLetter"));status.textContent="Sealing your letter... ✨";
  setTimeout(()=>{letter.classList.add("sealed");status.textContent="Flying to Eswaran... 🌙"},1800);
  setTimeout(()=>{overlay.classList.add("flying");status.textContent="Your letter is on its way... ❤️"},2900);
  setTimeout(()=>{status.textContent="Flying through the night... 🌙"},4200);
  setTimeout(()=>{status.textContent="Almost there... ✨"},5700);
  setTimeout(()=>{overlay.classList.add("final-flash");status.textContent="Your message has reached its destination. ❤️"},6500);
  setTimeout(openWhatsApp,7900);
}
initPage5();
if($("#page4Next"))$("#page4Next").onclick=()=>{showScene(5);initPage5()};

const choices={
 memory:["❤️","MEMORY","A memory is waiting for you. Replace this text with something only the two of you understand."],
 surprise:["🌸","SURPRISE","There are still more little surprises hidden in this story."],
 secret:["✨","SECRET","You found a tiny secret. Now keep going..."]
};
const opened=new Set();
$$(".choice-card").forEach(card=>card.onclick=()=>{
  const key=card.dataset.choice;if(opened.has(key))return;opened.add(key);
  const d=choices[key];$("#choiceIcon").textContent=d[0];$("#choiceTitle").textContent=d[1]+" — Unlocked 🔓";$("#choiceText").textContent=d[2];$("#unlockBox").classList.remove("hidden");$("#progress").textContent=`${opened.size} / 3 unlocked`;
  card.style.opacity=".45";card.style.pointerEvents="none";
  if(opened.size===3)$("#gameContinue").classList.remove("hidden");
});
$("#gameContinue").onclick=()=>showScene(7);
$("#secretObject").onclick=()=>{$("#secretObject").style.display="none";$("#foundMessage").classList.remove("hidden");heartBurst($("#foundMessage"))};
$("#foundContinue").onclick=()=>showScene(8);

$("#openLetter").onclick=()=>{
  $("#envelope").classList.add("open");heartBurst($("#openLetter"));
  setTimeout(()=>{$("#letterText").classList.remove("hidden");$("#openLetter").classList.add("hidden");$("#letterContinue").classList.remove("hidden")},850);
};
$("#letterContinue").onclick=()=>showScene(9);
$("#openGift").onclick=()=>{
  $("#gift").classList.add("open");heartBurst($("#openGift"));
  setTimeout(()=>{$("#giftReveal").classList.remove("hidden");$("#openGift").classList.add("hidden");$("#giftContinue").classList.remove("hidden")},700);
};
$("#giftContinue").onclick=()=>showScene(10);
setupRunaway($("#thinkBtn"),["Think faster 👀","I'm waiting...","Nice attempt 😂","YES ❤️"],$("#stayHint"));
$("#stayBtn").onclick=()=>{heartBurst($("#stayBtn"));setTimeout(()=>showScene("final"),650)};
$("#replayBtn").onclick=()=>location.reload();

$("#musicToggle").onclick=()=>{
  const m=$("#music");
  if(m.paused){startMusic();m.play();$("#musicToggle").textContent="🎵 ON"}else{m.pause();$("#musicToggle").textContent="🔇 OFF"}
};

function makeParticles(){
  const p=$("#particles");
  for(let i=0;i<28;i++){const x=document.createElement("i");x.textContent=i%4===0?"♥":"·";x.style.position="fixed";x.style.left=Math.random()*100+"vw";x.style.top=(70+Math.random()*30)+"vh";x.style.color=i%2?"#cbbaff":"#ff8fbc";x.style.opacity=.15+Math.random()*.35;x.style.fontSize=8+Math.random()*12+"px";p.appendChild(x);x.animate([{transform:"translateY(0)"},{transform:`translateY(-${70+Math.random()*150}vh)`}],{duration:7000+Math.random()*8000,iterations:Infinity,delay:-Math.random()*7000,easing:"linear"})}
}
function makeStars(){
  const sky=$("#stars");
  for(let i=0;i<130;i++){const star=document.createElement("i");star.style.position="fixed";star.style.left=Math.random()*100+"vw";star.style.top=Math.random()*100+"vh";star.style.width=1+Math.random()*2+"px";star.style.height=star.style.width;star.style.borderRadius="50%";star.style.background="#fff";star.style.opacity=.15+Math.random()*.6;star.style.boxShadow="0 0 6px rgba(255,220,255,.7)";sky.appendChild(star);if(i%4===0)star.animate([{opacity:.1},{opacity:.8},{opacity:.1}],{duration:1800+Math.random()*3000,iterations:Infinity,delay:-Math.random()*3000})}
}
makeParticles();
makeStars();
const cursorGlow=$("#cursorGlow");
if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  document.addEventListener("pointermove",e=>{cursorGlow.style.left=e.clientX+"px";cursorGlow.style.top=e.clientY+"px";cursorGlow.style.opacity="1"});
  secretCard.addEventListener("pointerenter",()=>{cursorGlow.style.width="32px";cursorGlow.style.height="32px"});
  secretCard.addEventListener("pointerleave",()=>{cursorGlow.style.width="18px";cursorGlow.style.height="18px"});
}
