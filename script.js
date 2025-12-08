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

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function toMinutes(h) {
  const [H, M] = h.split(":").map(Number);
  return H * 60 + M;
}
function blocksBetween(start, end) {
  return Math.round((toMinutes(end) - toMinutes(start)) / 30);
}

// ===================================================
// MINIMIZE MODE
// ===================================================
function toggleEmptyRows() {
  compactMode = !compactMode;
  $("#minimizeBtn").setAttribute("aria-pressed", compactMode);
  $("#minimizeIcon").classList.toggle("fa-expand-arrows-alt", !compactMode);
  $("#minimizeIcon").classList.toggle("fa-compress-arrows-alt", compactMode);
  if(window.innerWidth>=768) generateGrid();
}

// ===================================================
// GRID MODE (DESKTOP)
// ===================================================
function generateGrid() {
  const grid = $("#grid-content");
  grid.innerHTML = "";
  const occupied = {};

  hours.forEach((h,rowIndex)=>{
    const hourCell = document.createElement("div");
    hourCell.className="border p-2 font-semibold text-center hour-cell";
    hourCell.style.height=`${CELL_HEIGHT}px`;
    hourCell.textContent=h;
    grid.appendChild(hourCell);

    for(let d=0;d<7;d++){
      const key=`${rowIndex}-${d}`;
      const cell=document.createElement("div");
      cell.className="border min-h-[40px] relative";
      cell.style.height=`${CELL_HEIGHT}px`;

      if(compactMode){
        const item = scheduleData.find(e=>e.day===d && e.start===h);
        if(item){
          const bar = createBar(item,CELL_HEIGHT-10);
          cell.appendChild(bar);
        }
        grid.appendChild(cell);
        continue;
      }

      if(occupied[key]){
        grid.appendChild(cell);
        continue;
      }

      const item = scheduleData.find(e=>e.day===d && e.start===h);
      if(item){
        const blocks = blocksBetween(item.start,item.end);
        for(let b=0;b<blocks;b++){
          occupied[`${rowIndex+b}-${d}`]=true;
        }
        const bar = createBar(item, CELL_HEIGHT*blocks-10);
        cell.appendChild(bar);
      }

      grid.appendChild(cell);
    }
  });
}

// ===================================================
// CREATE BAR
// ===================================================
function createBar(item, height){
  const div = document.createElement("div");
  div.className=`schedule-item ${categoryClass[item.type]}`;
  div.style.height=`${height}px`;
  div.title=`${item.title} (${item.start} - ${item.end})`;
  div.onclick = () => showDetail(item);
  div.innerHTML=`<span class="icon">${item.icon}</span> <span>${item.title}</span>`;
  return div;
}

// ===================================================
// SHOW DETAIL
// ===================================================
function showDetail(item){
  const $detail=$("#detail-content");
  $detail.innerHTML=`
    <div><strong>${item.title}</strong></div>
    <div>Hora: ${item.start} - ${item.end}</div>
    <div>Tipo: ${item.type}</div>
  `;
}

// ===================================================
// MOBILE LIST
// ===================================================
function generateList(){
  const wrapper=$("#list-wrapper");
  wrapper.innerHTML="";
  days.forEach((day,i)=>{
    const dayCard=document.createElement("div");
    dayCard.className="day-card";
    const dayTitle=document.createElement("div");
    dayTitle.className="font-semibold mb-2";
    dayTitle.textContent=day.charAt(0).toUpperCase()+day.slice(1);
    dayCard.appendChild(dayTitle);

    const events=scheduleData.filter(e=>e.day===i);
    events.forEach(e=>{
      const row=document.createElement("div");
      row.className="event-row";
      row.innerHTML=`<span>${e.icon}</span> ${e.title} (${e.start}-${e.end})`;
      row.onclick=()=>showDetail(e);
      dayCard.appendChild(row);
    });

    wrapper.appendChild(dayCard);
  });
}

// ===================================================
// FILTER
// ===================================================
function filterSchedule(type){
  $$(".filter-btn").forEach(btn=>btn.classList.remove("active"));
  $(`.filter-btn[data-filter="${type}"]`)?.classList.add("active");

  if(window.innerWidth>=768){
    generateGridFiltered(type);
  }else{
    generateListFiltered(type);
  }
}

function generateGridFiltered(type){
  const grid=$("#grid-content");
  grid.innerHTML="";
  const occupied={};

  hours.forEach((h,rowIndex)=>{
    const hourCell = document.createElement("div");
    hourCell.className="border p-2 font-semibold text-center hour-cell";
    hourCell.style.height=`${CELL_HEIGHT}px`;
    hourCell.textContent=h;
    grid.appendChild(hourCell);

    for(let d=0;d<7;d++){
      const key=`${rowIndex}-${d}`;
      const cell=document.createElement("div");
      cell.className="border min-h-[40px] relative";
      cell.style.height=`${CELL_HEIGHT}px`;

      const item=scheduleData.find(e=>e.day===d && e.start===h && (type==="all"||e.type===type));
      if(item){
        const blocks = blocksBetween(item.start,item.end);
        for(let b=0;b<blocks;b++){
          occupied[`${rowIndex+b}-${d}`]=true;
        }
        const bar = createBar(item, CELL_HEIGHT*blocks-10);
        cell.appendChild(bar);
      }
      grid.appendChild(cell);
    }
  });
}

function generateListFiltered(type){
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
      row.className="event-row";
      row.innerHTML=`<span>${e.icon}</span> ${e.title} (${e.start}-${e.end})`;
      row.onclick=()=>showDetail(e);
      dayCard.appendChild(row);
    });

    wrapper.appendChild(dayCard);
  });
}

// ===================================================
// DARK MODE
// ===================================================
$("#darkToggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  const pressed=document.body.classList.contains("dark");
  $("#darkToggle").setAttribute("aria-pressed",pressed);
});

// ===================================================
// SCROLL TO SECTION
// ===================================================
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// ===================================================
// CHART
// ===================================================
function renderChart(){
  const ctx=$("#balanceChart").getContext("2d");
  const counts={academic:0,art:0,study:0,life:0};
  scheduleData.forEach(e=>{ counts[e.type]=(counts[e.type]||0)+blocksBetween(e.start,e.end); });

  new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:Object.keys(counts),
      datasets:[{
        data:Object.values(counts),
        backgroundColor:[
          "rgba(14,165,233,0.6)",
          "rgba(244,114,182,0.6)",
          "rgba(52,211,153,0.6)",
          "rgba(251,146,60,0.6)"
        ]
      }]
    },
    options:{
      plugins:{
        legend:{ position:"bottom", labels:{color:"var(--text)"} }
      },
      responsive:true,
      maintainAspectRatio:false
    }
  });
}

// ===================================================
// INIT
// ===================================================
function init(){
  generateGrid();
  generateList();
  renderChart();
}

window.addEventListener("resize",()=>{ filterSchedule($(".filter-btn.active").dataset.filter) });
window.addEventListener("DOMContentLoaded",init);
