// =========================
// CONFIGURACIÓN DE DATOS
// =========================
const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hours = [
  "07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"
];

const scheduleData = [
  { day: 2, start: "08:00", end: "10:30", title: "Estadística", type: "academic", icon: "📊", desc: "Clase teórica/práctica" },
  { day: 2, start: "15:00", end: "16:30", title: "Inglés", type: "academic", icon: "🇬🇧", desc: "Curso de inglés" },
  { day: 2, start: "17:30", end: "18:30", title: "Merengue", type: "art", icon: "💃", desc: "Clase de baile" },
  { day: 3, start: "07:30", end: "10:30", title: "CTS", type: "academic", icon: "🌍", desc: "Ciencia, Tecnología y Sociedad" },
  { day: 4, start: "08:00", end: "10:30", title: "Estadística", type: "academic", icon: "📊", desc: "Clase teórica/práctica" },
  { day: 4, start: "18:30", end: "21:30", title: "Sistemas Inf.", type: "academic", icon: "💻", desc: "Sistemas de Información" },
  { day: 6, start: "08:00", end: "13:00", title: "Redes", type: "academic", icon: "🌐", desc: "Redes de Computadoras" }
];

const CELL_HEIGHT = 64;
let compactMode = false;
let currentFilter = "all";
let balanceChartInstance = null;

// =========================
// HELPERS
// =========================
const toMinutes = h => h.split(':').reduce((h, m) => h * 60 + +m);
const blocksBetween = (start, end) => (toMinutes(end) - toMinutes(start)) / 60;
const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
);

// =========================
// LÓGICA DE DETALLES
// =========================
function showDetail(item) {
  const content = document.getElementById('detail-content');
  content.innerHTML = `
    <div class="bg-${escapeHTML(item.type)} p-3 rounded-xl mb-4 text-white font-bold inline-block shadow-md">
      ${escapeHTML(item.icon)} ${escapeHTML(item.type).toUpperCase()}
    </div>
    <h2 class="text-xl font-extrabold mb-1">${escapeHTML(item.title)}</h2>
    <p class="text-blue-500 font-bold mb-3">${escapeHTML(item.start)} — ${escapeHTML(item.end)}</p>
    <p class="text-sm opacity-90">${escapeHTML(item.desc)}</p>
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
      daySection.innerHTML = `<h4 class="font-bold text-xs uppercase tracking-widest opacity-70 mb-3">${escapeHTML(dayName)}</h4>`;
      
      events.sort((a,b) => toMinutes(a.start) - toMinutes(b.start)).forEach(item => {
        const card = document.createElement('button');
        card.className = "w-full text-left glass p-4 rounded-2xl mb-2 flex items-center justify-between border border-white/10 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-blue-500";
        card.onclick = () => showDetail(item);
        card.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="text-2xl">${escapeHTML(item.icon)}</span>
            <div>
              <div class="font-bold text-sm text-[var(--text)]">${escapeHTML(item.title)}</div>
              <div class="text-[10px] opacity-80 text-[var(--text-soft)]">${escapeHTML(item.start)} - ${escapeHTML(item.end)}</div>
            </div>
          </div>
          <i class="fas fa-chevron-right opacity-50 text-xs"></i>
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
  
  // Determinar qué horas mostrar
  const hoursToRender = compactMode 
    ? hours.filter(h => scheduleData.some(e => {
        const startHour = toMinutes(e.start) / 60;
        const endHour = toMinutes(e.end) / 60;
        const currentHour = toMinutes(h) / 60;
        return currentHour >= Math.floor(startHour) && currentHour < Math.ceil(endHour) && (filter === "all" || e.type === filter);
      }))
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

      // Encontrar TODOS los eventos que empiezan en esta hora
      const items = scheduleData.filter(e => e.day === d && e.start.startsWith(h.substring(0,2)) && (filter === "all" || e.type === filter));
      
      items.forEach((item, index) => {
        const durationBlocks = blocksBetween(item.start, item.end);
        const height = durationBlocks * CELL_HEIGHT;
        
        // Calcular desplazamiento si no empieza en el minuto 00
        const startMinutes = toMinutes(item.start) % 60;
        const topOffset = (startMinutes / 60) * CELL_HEIGHT;
        
        const bar = document.createElement('button');
        bar.className = `schedule-item bg-${item.type} focus:outline-none focus:ring-2 focus:ring-white`;
        
        // Ajustar posición para eventos superpuestos
        let width = 'calc(100% - 8px)';
        let left = '4px';
        if (items.length > 1) {
          width = `calc(${100 / items.length}% - 8px)`;
          left = `calc(${index * (100 / items.length)}% + 4px)`;
        }

        bar.style.height = `${height - 4}px`;
        bar.style.top = `${topOffset + 2}px`;
        bar.style.width = width;
        bar.style.left = left;
        
        bar.innerHTML = `<i class="text-lg mb-1">${escapeHTML(item.icon)}</i><span class="px-1 text-center truncate w-full">${escapeHTML(item.title)}</span>`;
        bar.onclick = () => showDetail(item);
        cell.appendChild(bar);
      });
      container.appendChild(cell);
    }
  });
}

// =========================
// ACTUALIZAR GRÁFICO
// =========================
function updateChart(filter) {
  const filteredData = scheduleData.filter(e => filter === "all" || e.type === filter);
  
  const types = ['academic', 'art', 'study', 'life'];
  const labels = ['Académico', 'Arte', 'Estudio', 'Vida'];
  const colors = ['#3b82f6', '#f472b6', '#10b981', '#f59e0b'];
  
  const data = types.map(type => {
    return filteredData.filter(e => e.type === type).reduce((acc, e) => acc + blocksBetween(e.start, e.end), 0);
  });

  if (balanceChartInstance) {
    balanceChartInstance.data.datasets[0].data = data;
    balanceChartInstance.update();
  } else {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    balanceChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}

// =========================
// CONTROLES
// =========================
function renderAll() {
  if (window.innerWidth < 768) {
    document.getElementById('grid-wrapper').classList.add('hidden');
    document.getElementById('list-wrapper').classList.remove('hidden');
    generateMobileList(currentFilter);
  } else {
    document.getElementById('grid-wrapper').classList.remove('hidden');
    document.getElementById('list-wrapper').classList.add('hidden');
    generateGrid(currentFilter);
  }
  updateChart(currentFilter);
}

function filterSchedule(type) {
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => {
    const isActive = b.dataset.filter === type;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive);
  });
  renderAll();
}

function toggleEmptyRows() {
  compactMode = !compactMode;
  const btn = document.getElementById('minimizeBtn');
  btn.innerHTML = compactMode 
    ? `<i class="fas fa-expand-alt mr-1" aria-hidden="true"></i> Expandir` 
    : `<i class="fas fa-compress-alt mr-1" aria-hidden="true"></i> Compactar`;
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
  
  document.getElementById('darkToggle').onclick = toggleDarkMode;
};

// Escuchar cambios de tamaño para cambiar entre lista y grid
window.onresize = renderAll;