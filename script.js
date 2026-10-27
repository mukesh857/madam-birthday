const $ = (s) => document.querySelector(s);
const music = $("#music");
const fireworks = $("#fireworks");
const ctx = fireworks.getContext("2d");
let particles = [], running = false;

function resize(){ fireworks.width=innerWidth*devicePixelRatio; fireworks.height=innerHeight*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
addEventListener("resize", resize); resize();

function toast(text){
  const t=$("#toast"); t.textContent=text; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),3000);
}

function balloons(count=28){
  const wrap=$("#balloons");
  const symbols=["#ef6f9f","#b889dc","#78a8df","#f1bd72","#77cbb4","#ef8a72"];
  for(let i=0;i<count;i++){
    const b=document.createElement("div"); b.className="balloon";
    b.style.left=Math.random()*100+"%"; b.style.background=symbols[i%symbols.length];
    b.style.color=symbols[i%symbols.length]; b.style.animationDelay=Math.random()*1.8+"s";
    b.style.transform=`scale(${.7+Math.random()*.7})`;
    wrap.appendChild(b); setTimeout(()=>b.remove(),7000);
  }
}

function confetti(count=170){
  const wrap=$("#confetti");
  for(let i=0;i<count;i++){
    const c=document.createElement("i");
    c.style.position="absolute"; c.style.left=Math.random()*100+"%"; c.style.top="-15px";
    c.style.width=(5+Math.random()*7)+"px"; c.style.height=(8+Math.random()*12)+"px";
    c.style.background=["#fff","#f3a8c8","#d6b3ee","#f6ca76","#9edfd0"][i%5];
    c.style.transform=`rotate(${Math.random()*360}deg)`;
    c.style.animation=`fall ${2+Math.random()*3}s ${Math.random()*1.5}s linear forwards`;
    wrap.appendChild(c); setTimeout(()=>c.remove(),6000);
  }
}
const sheet=document.createElement("style");
sheet.textContent="@keyframes fall{to{top:110vh;transform:rotate(900deg) translateX("+(Math.random()*150-75)+"px)}}";
document.head.appendChild(sheet);

function burst(x,y){
  const n=70;
  for(let i=0;i<n;i++){
    const a=Math.PI*2*i/n, speed=1+Math.random()*5;
    particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:1,size:1+Math.random()*2});
  }
}
function fireworksLoop(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=.035; p.life-=.012;
    ctx.globalAlpha=Math.max(p.life,0);
    ctx.fillStyle="rgba(255,255,255,.9)";
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
  });
  particles=particles.filter(p=>p.life>0);
  requestAnimationFrame(fireworksLoop);
}
fireworksLoop();

function launchFireworks(){
  for(let i=0;i<9;i++){
    setTimeout(()=>burst(innerWidth*(.15+Math.random()*.7), innerHeight*(.15+Math.random()*.45)),i*320);
  }
  confetti(240);
}

$("#startBtn").addEventListener("click",()=>{
  balloons(35); confetti(100);
  document.body.classList.add("started");
  $("#memory").scrollIntoView({behavior:"smooth"});
  toast("🎉 Let the birthday celebration begin!");
  // Browsers allow audio only after a user gesture. Add assets/birthday.mp3 to enable music.
  if(music.src) music.play().catch(()=>{});
});

$("#wishBtn").addEventListener("click",()=>{
  $(".cake").classList.add("off");
  $("#cutBtn").disabled=false;
  toast("✨ Wish made! May it come true.");
  setTimeout(()=>{ launchFireworks(); },700);
});

$("#cutBtn").addEventListener("click",()=>{
  $(".cake").classList.add("cut");
  $("#cutBtn").textContent="🎉 Cake Cut!";
  confetti(220); balloons(20);
  setTimeout(()=>$("#celebrate").scrollIntoView({behavior:"smooth"}),900);
});

$("#fireworkBtn").addEventListener("click",()=>{
  launchFireworks();
  toast("🎆 One more spectacular celebration for Neha Mam!");
});

$("#againBtn").addEventListener("click",()=>{
  window.scrollTo({top:0,behavior:"smooth"});
  setTimeout(()=>balloons(25),700);
});
