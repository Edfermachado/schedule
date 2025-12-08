// =========================
// CONFIG
// =========================
const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const hours = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00"
];

const scheduleData = [
  { day:0, start:"13:00", end:"17:00", title:"Teatro", type:"art", icon:"🎭" },
  { day:1, start:"17:00", end:"19:00", title:"Lenguaje de Programación", type:"academic", icon:"💻" },
  { day:2, start:"07:30", end:"10:30", title:"Probabilidad", type:"academic", icon:"🔢" },
  { day:2, start:"15:00", end:"16:30", title:"Inglés", type:"academic", icon:"🇬🇧" },
  { day:3, start:"10:30", end:"12:00", title:"Metodología", type:"academic", icon:"📝" },
  { day:4, start:"07:30", end:"10:30", title:"Probabilidad", type:"academic", icon:"🔢" },
  { day:4, start:"15:00", end:"16:30", title:"Inglés", type:"academic", icon:"🇬🇧" },
  { day:4, start:"18:00", end:"20:00", title:"Ingeniería de Software", type:"academic", icon:"💻" },
  { day:6, start:"08:30", end:"12:00", title:"Redes I", type:"academic", icon:"🌐" }
];

const categoryClass = {
  academic: "bg-academic",
  art: "bg-art",
  study: "bg-study",
  life: "bg-life"
};

const CELL_HEIGHT = 48;
let compactMode = false;

// =========================
// UTIL
// =========================
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function toMinutes(h){
  const [H,M]=h.split(":").map(Number);
  return H*60+M;
}
function blocksBetween(start,end){
  return Math.round((toMinutes(end)-toMinutes(start))/30);
}

// =========================
// MINIMIZE MODE
// =========================
function toggleEmptyRows(){
  compactMode = !compactMode;
  $("#minimizeBtn").setAttribute("aria-pressed",compactMode);
  $("#minimizeIcon").classList.toggle("fa-expand-arrows-alt",!compactMode);
  $("#minimizeIcon").classList.toggle("fa-compress-arrows-alt",compactMode);
  renderAll();
}

// =========================
// CREATE BAR
// =========================
function createBar(item,height){
  const div = document.createElement("div");
  div.className=`schedule-item ${categoryClass[item.type]}`;
  div.style.height=`${height}px`;
  div.title=`${item.title} (${item.start}-${item.end})`;
  div.innerHTML=`<span class="icon">${item.icon}</span> <span>${item.title}</span>`;
  div.onclick = ()=>showDetail(item);
  return div;
}

// =========================
// GRID MODE (DESKTOP)
// =========================
function generateGrid(type="all"){
  const grid=$("#grid-content");
  grid.innerHTML="";
  const occupied={};

  hours.forEach((h,rowIndex)=>{
    // hora
    const hourCell = document.createElement("div");
    hourCell.className="border p-2 font-semibold text-center hour-cell";
    hourCell.style.height=`${CELL_HEIGHT}px`;
    hourCell.textContent=h;
    grid.appendChild(hourCell);

    // días
    for(let d=0;d<7;d++){
      const key=`${rowIndex}-${d}`;
      const cell=document.createElement("div");
      cell.className="border min-h-[40px] relative";
      cell.style.height=`${CELL_HEIGHT}px`;

      if(compactMode){
        const item=scheduleData.find(e=>e.day===d && e.start===h && (type==="all"||e.type===type));
        if(item) cell.appendChild(createBar(item,CELL_HEIGHT-10));
        grid.appendChild(cell);
        continue;
      }

      if(occupied[key]){
        grid.appendChild(cell);
        continue;
      }

      const item=scheduleData.find(e=>e.day===d && e.start===h && (type==="all"||e.type===type));
      if(item){
        const blocks = blocksBetween(item.start,item.end);
        for(let b=0;b<blocks;b++) occupied[`${rowIndex+b}-${d}`]=true;
        cell.appendChild(createBar(item,CELL_HEIGHT*blocks-10));
      }

      grid.appendChild(cell);
    }
  });
}

// =========================
// MOBILE LIST
// =========================
function generateList(type="all"){
  const wrapper=$("#list-wrapper");
  wrapper.innerHTML="";
  days.forEach((day,i)=>{
    const dayCard=document.createElement("div");
    dayCard.className="day-card";
    const dayTitle=document.createElement("div");
    dayTitle.className="font-semibold mb-2";
    dayTitle.textContent=day.charAt(0).toUpperCase()+day.slice(1);
    dayCard.appendChild(dayTitle);

    const events=scheduleData.filter(e=>e.day===i && (type==="all"||e.type===type));
    events.forEach(e=>{
      const row=document.createElement("div");
      row.className="event-row schedule-item";
      row.innerHTML=`<span>${e.icon}</span> ${e.title} (${e.start}-${e.end})`;
      row.onclick=()=>showDetail(e);
      dayCard.appendChild(row);
    });

    if(events.length===0) dayCard.classList.add("hidden");
    wrapper.appendChild(dayCard);
  });
}

// =========================
// SHOW DETAIL
// =========================
function showDetail(item){
  const $detail=$("#detail-content");
  $detail.innerHTML=`
    <div><strong>${item.icon} ${item.title}</strong></div>
    <div>Hora: ${item.start} - ${item.end}</div>
    <div>Tipo: ${item.type}</div>
  `;
}

// =========================
// FILTER
// =========================
function filterSchedule(type){
  $$(".filter-btn").forEach(btn=>btn.classList.remove("active"));
  $(`.filter-btn[data-filter="${type}"]`)?.classList.add("active");

  if(window.innerWidth>=768) generateGrid(type);
  else generateList(type);
}

// =========================
// DARK MODE
// =========================
function toggleDarkMode(){
  document.documentElement.classList.toggle("dark");
  const on = document.documentElement.classList.contains("dark");
  $("#darkToggle").setAttribute("aria-pressed",on);
  localStorage.theme = on?"dark":"light";
}

// =========================
// SCROLL TO SECTION
// =========================
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// =========================
// CHART
// =========================
function renderChart(){
  const ctx=$("#balanceChart").getContext("2d");
  const counts={academic:0,art:0,study:0,life:0};
  scheduleData.forEach(e=>{
    counts[e.type]=(counts[e.type]||0)+((toMinutes(e.end)-toMinutes(e.start))/60);
  });

  new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:["Académico","Arte","Estudio","Vida"],
      datasets:[{data:Object.values(counts),
                 backgroundColor:["#60a5fa","#f472b6","#34d399","#fb923c"]}]
    },
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:"bottom"}}}
  });
}

// =========================
// RESPONSIVE RENDER
// =========================
function renderAll(){
  if(window.innerWidth<768) generateList($(".filter-btn.active")?.dataset.filter||"all");
  else generateGrid($(".filter-btn.active")?.dataset.filter||"all");
  renderChart();
  adjustBodyHeight();
}

// =========================
// ADJUST BODY HEIGHT
// =========================
function adjustBodyHeight(){
  const mainHeight = document.querySelector("main").offsetHeight;
  const vh = window.innerHeight;
  if(mainHeight<vh) document.body.style.minHeight=`${vh}px`;
  else document.body.style.minHeight="100%";
}

// =========================
// INIT
// =========================
window.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.theme==="dark" || (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)){
    document.documentElement.classList.add("dark");
    $("#darkToggle").setAttribute("aria-pressed","true");
  }

  renderAll();

  $("#darkToggle").addEventListener("click",toggleDarkMode);
});

window.addEventListener("resize",()=>{ clearTimeout(window._resizeTimeout); window._resizeTimeout=setTimeout(renderAll,120); });
