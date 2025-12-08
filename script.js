// =========================
// CONFIGURACIÓN DE DATOS
// =========================
const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hours = [
  "07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"
];

const scheduleData = [
  { day:0, start:"13:00", end:"17:00", title:"Teatro", type:"art", icon:"🎭", desc: "Clase de actuación" },
  { day:1, start:"17:00", end:"19:00", title:"Lenguaje Prog", type:"academic", icon:"💻", desc: "Laboratorio C++" },
  { day:2, start:"07:30", end:"10:30", title:"Probabilidad", type:"academic", icon:"🔢", desc: "Aula 302" },
  { day:2, start:"15:00", end:"16:30", title:"Inglés", type:"academic", icon:"🇬🇧", desc: "Zoom ID: 231..." },
  { day:3, start:"10:30", end:"12:00", title:"Metodología", type:"academic", icon:"📝", desc: "Teoría" },
  { day:4, start:"07:30", end:"10:30", title:"Probabilidad", type:"academic", icon:"🔢", desc: "Aula 302" },
  { day:4, start:"15:00", end:"16:30", title:"Inglés", type:"academic", icon:"🇬🇧", desc: "Conversación" },
  { day:4, start:"18:00", end:"20:00", title:"Ing Software", type:"academic", icon:"💻", desc: "Sprint 2" },
  { day:6, start:"08:30", end:"12:00", title:"Redes I", type:"academic", icon:"🌐", desc: "Práctica de ruteo" }
];

const CELL_HEIGHT = 64;
let compactMode = false;
let currentFilter = "all";

// =========================
// HELPERS
// =========================
const toMinutes = h => h.split(':').reduce((h, m) => h * 60 + +m);
const blocksBetween = (start, end) => (toMinutes(end) - toMinutes(start)) / 60;

// =========================
// LÓGICA DE DETALLES
// =========================
function showDetail(item) {
  const content = document.getElementById('detail-content');
  content.innerHTML = `
    <div class="bg-academic p-3 rounded-xl mb-4 text-white font-bold inline-block shadow-md" style="background: var(--primary)">
      ${item.icon} ${item.type.toUpperCase()}
    </div>
    <h2 class="text-xl font-extrabold mb-1">${item.title}</h2>
    <p class="text-blue-500 font-bold mb-3">${item.start} — ${item.end}</p>
    <p class="text-sm opacity-70">${item.desc}</p>
  `;
}

// =========================
// RENDERIZADO MÓVIL (LISTA)
// =========================
function generateMobileList(filter = "all") {
  const container = document.getElementById('list-wrapper');
  container.innerHTML = "";
  
  days.forEach((dayName, dayIdx) => {
    const events = scheduleData.filter(e => e.day === dayIdx && (filter === "all" || e.type === filter));
    
    if (events.length > 0) {
      const daySection = document.createElement('div');
      daySection.className = "mb-6";
      daySection.innerHTML = `<h4 class="font-bold text-xs uppercase tracking-widest opacity-50 mb-3">${dayName}</h4>`;
      
      events.sort((a,b) => toMinutes(a.start) - toMinutes(b.start)).forEach(item => {
        const card = document.createElement('div');
        card.className = "glass p-4 rounded-2xl mb-2 flex items-center justify-between border border-white/10";
        card.onclick = () => showDetail(item);
        card.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="text-2xl">${item.icon}</span>
            <div>
              <div class="font-bold text-sm">${item.title}</div>
              <div class="text-[10px] opacity-60">${item.start} - ${item.end}</div>
            </div>
          </div>
          <i class="fas fa-chevron-right opacity-30 text-xs"></i>
        `;
        daySection.appendChild(card);
      });
      container.appendChild(daySection);
    }
  });
}

// =========================
// RENDERIZADO DESKTOP (GRID)
// =========================
function generateGrid(filter = "all") {
  const container = document.getElementById('grid-content');
  container.innerHTML = "";
  
  // Determinar qué horas mostrar (si está compactado, solo horas con eventos)
  const hoursToRender = compactMode 
    ? hours.filter(h => scheduleData.some(e => e.start.startsWith(h.substring(0,2)) && (filter === "all" || e.type === filter)))
    : hours;

  hoursToRender.forEach((h) => {
    const hourLabel = document.createElement('div');
    hourLabel.className = "header-cell flex items-center justify-center border-b border-white/5";
    hourLabel.style.height = `${CELL_HEIGHT}px`;
    hourLabel.textContent = h;
    container.appendChild(hourLabel);

    for(let d=0; d<7; d++) {
      const cell = document.createElement('div');
      cell.className = "border-b border-r border-white/5 relative bg-white/5";
      cell.style.height = `${CELL_HEIGHT}px`;

      const item = scheduleData.find(e => e.day === d && e.start.startsWith(h.substring(0,2)) && (filter === "all" || e.type === filter));
      
      if(item) {
        const height = blocksBetween(item.start, item.end) * CELL_HEIGHT;
        const bar = document.createElement('div');
        bar.className = `schedule-item bg-${item.type}`;
        bar.style.height = `${height - 8}px`;
        bar.innerHTML = `<i class="text-lg mb-1">${item.icon}</i><span class="px-1 text-center">${item.title}</span>`;
        bar.onclick = () => showDetail(item);
        cell.appendChild(bar);
      }
      container.appendChild(cell);
    }
  });
}

// =========================
// CONTROLES
// =========================
function renderAll() {
  if (window.innerWidth < 768) {
    generateMobileList(currentFilter);
  } else {
    generateGrid(currentFilter);
  }
}

function filterSchedule(type) {
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === type));
  renderAll();
}

function toggleEmptyRows() {
  compactMode = !compactMode;
  const btn = document.getElementById('minimizeBtn');
  btn.innerHTML = compactMode 
    ? `<i class="fas fa-expand-alt mr-1"></i> Expandir` 
    : `<i class="fas fa-compress-alt mr-1"></i> Compactar`;
  renderAll();
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// =========================
// INICIALIZACIÓN
// =========================
window.onload = () => {
  if (localStorage.theme === 'dark') document.documentElement.classList.add('dark');
  
  renderAll();
  
  // Chart.js initialization
  const ctx = document.getElementById('balanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Académico', 'Arte', 'Estudio', 'Vida'],
      datasets: [{
        data: [70, 10, 10, 10],
        backgroundColor: ['#3b82f6', '#f472b6', '#10b981', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  document.getElementById('darkToggle').onclick = toggleDarkMode;
};

// Escuchar cambios de tamaño para cambiar entre lista y grid
window.onresize = renderAll;