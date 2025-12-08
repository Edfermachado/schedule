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
        const blocks = blocks
