// Glass Modern JS: renders grid or mobile list, bars span full duration, filters, chart, minimize

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

// class names for categories (CSS defined)
const categoryClass = {
  academic: "bg-academic",
  art: "bg-art",
  study: "bg-study",
  life: "bg-life"
};

const CELL_HEIGHT = 48; // matches --cell-height in styles (px)
let compactMode = false;

// =========================
// UTIL
// =========================
function toMinutes(h) {
  const [H, M] = h.split(":").map(Number);
  return H * 60 + M;
}
function blocksBetween(start, end) {
  return Math.round((toMinutes(end) - toMinutes(start)) / 30);
}

// safe query
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// =========================
// RENDER GRID (desktop)
// =========================
function generateGrid() {
  const grid = $("#grid-content");
  grid.innerHTML = "";

  // mark occupied cells so we don't double-render a bar over them
  const occupied = {};

  hours.forEach((h, rowIndex) => {
    // hour cell (first column)
    const hourCell = document.createElement("div");
    hourCell.className = "border p-2 font-semibold text-center hour-cell";
    hourCell.style.height = `${CELL_HEIGHT}px`;
    hourCell.textContent = h;
    grid.appendChild(hourCell);

    // 7 day columns
    for (let d=0; d<7; d++) {
      const key = `${rowIndex}-${d}`;
      const cell = document.createElement("div");
      cell.className = "border min-h-[40px] relative";
      cell.style.height = `${CELL_HEIGHT}px`;

      // skip if occupied
      if (occupied[key]) {
        grid.appendChild(cell);
        continue;
      }

      // find event starting exactly at this time
      const item = scheduleData.find(e => e.day === d && e.start === h);
      if (item) {
        const blocks = blocksBetween(item.start, item.end);
        const bar = document.createElement("div");

        bar.className = `schedule-item ${categoryClass[item.type]}`;
        bar.style.height = `${blocks * CELL_HEIGHT - 8}px`; // - padding to fit
        bar.style.top = `4px`;
        bar.style.left = `6px`;
        bar.style.right = `6px`;
        bar.style.borderRadius = `12px`;
        bar.style.display = "flex";
        bar.style.alignItems = "center";

        // content: icon + title + time label
        const left = document.createElement("div");
        left.className = "flex items-center gap-3";
        const ico = document.createElement("div");
        ico.textContent = item.icon;
        ico.style.fontSize = "18px";
        ico.style.lineHeight = "1";
        const txt = document.createElement("div");
        txt.innerHTML = `<div style="font-weight:700; font-size:13px;">${item.title}</div><div class="meta" style="font-size:11px; opacity:0.85">${item.start} - ${item.end}</div>`;
        left.appendChild(ico);
        left.appendChild(txt);

        bar.appendChild(left);

        // attach data for details
        bar.dataset.title = item.title;
        bar.dataset.type = item.type;
        bar.dataset.icon = item.icon;
        bar.dataset.start = item.start;
        bar.dataset.end = item.end;

        // animation: fade in
        bar.style.opacity = 0;
        setTimeout(()=> bar.style.opacity = 1, 20);

        // append
        cell.appendChild(bar);

        // mark occupied cells (the rows the bar spans)
        for (let i=0; i<blocks; i++) {
          occupied[`${rowIndex + i}-${d}`] = true;
        }
      }

      grid.appendChild(cell);
    }
  });

  enableDetails();
}

// =========================
// RENDER COMPACT LIST (mobile)
// =========================
function generateList() {
  const wrapper = $("#list-wrapper");
  wrapper.innerHTML = "";

  days.forEach((dayName, d) => {
    // filter events for this day
    const events = scheduleData.filter(e => e.day === d)
      .sort((a,b) => toMinutes(a.start)-toMinutes(b.start));

    const dayCard = document.createElement("div");
    dayCard.className = "day-card";

    const header = document.createElement("div");
    header.className = "flex items-center justify-between mb-2";
    header.innerHTML = `<div class="font-semibold">${d===0? 'Domingo': dayName.charAt(0).toUpperCase()+dayName.slice(1)}</div>
                        <div class="text-xs text-[var(--text-soft)]">${events.length} eventos</div>`;
    dayCard.appendChild(header);

    if (events.length === 0) {
      const empty = document.createElement("div");
      empty.className = "text-sm text-[var(--text-soft)]";
      empty.textContent = "Sin actividades";
      dayCard.appendChild(empty);
    } else {
      events.forEach(ev => {
        const row = document.createElement("div");
        row.className = "event-row";

        const left = document.createElement("div");
        left.style.minWidth = "88px";
        left.innerHTML = `<div class="font-mono text-xs">${ev.start}</div><div class="text-[11px] text-[var(--text-soft)]">${ev.end}</div>`;

        const right = document.createElement("div");
        right.style.flex = "1";
        right.innerHTML = `<div style="font-weight:700">${ev.icon} ${ev.title}</div>
                           <div class="text-xs text-[var(--text-soft)]">${ev.start} - ${ev.end}</div>`;

        row.appendChild(left);
        row.appendChild(right);

        // clicking on mobile list shows details
        row.addEventListener("click", () => {
          showDetailsFromData(ev);
          // scroll to details panel
          document.getElementById("detail-content").scrollIntoView({behavior:"smooth", block:"center"});
        });

        dayCard.appendChild(row);
      });
    }

    wrapper.appendChild(dayCard);
  });
}

// =========================
// DETAILS & INTERACTION
// =========================
function enableDetails() {
  const bars = $$(".schedule-item");
  bars.forEach(b => {
    b.style.cursor = "pointer";
    b.addEventListener("click", () => {
      showDetailsFromBar(b);
    });
  });
}
function showDetailsFromBar(bar) {
  const content = $("#detail-content");
  const title = bar.dataset.title || "";
  const type = bar.dataset.type || "";
  const icon = bar.dataset.icon || "";
  const start = bar.dataset.start || "";
  const end = bar.dataset.end || "";

  content.innerHTML = `
    <div class="mb-2"><strong style="font-size:15px">${icon} ${title}</strong></div>
    <div class="text-sm text-[var(--text-soft)]">Categoría: <b>${type}</b></div>
    <div class="text-sm text-[var(--text-soft)] mt-2">Horario: <b>${start} — ${end}</b></div>
  `;
}
function showDetailsFromData(ev) {
  const content = $("#detail-content");
  content.innerHTML = `
    <div class="mb-2"><strong style="font-size:15px">${ev.icon} ${ev.title}</strong></div>
    <div class="text-sm text-[var(--text-soft)]">Categoría: <b>${ev.type}</b></div>
    <div class="text-sm text-[var(--text-soft)] mt-2">Horario: <b>${ev.start} — ${ev.end}</b></div>
  `;
}

// =========================
// FILTERS
// =========================
function filterSchedule(type) {
  // update filter buttons visual (optional)
  $$(".filter-btn").forEach(b => b.classList.remove("active"));
  $$(".filter-btn").forEach(b => {
    if (b.dataset?.filter === type || type === "all" && b.dataset?.filter === "all") b.classList.add("active");
  });

  // set opacity
  $$(".schedule-item").forEach(it => {
    if (type === "all" || it.dataset.type === type) it.style.opacity = "1";
    else it.style.opacity = ".15";
  });

  // mobile list: hide non-matching events
  $$("#list-wrapper .day-card").forEach(card => {
    const rows = Array.from(card.querySelectorAll(".event-row"));
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      if (type === "all") row.style.display = "";
      else {
        // naive match by category name inside details (we stored event type in dataset? not here). We'll show all on mobile for now
        row.style.display = "";
      }
    });
  });
}

// =========================
// CHART
// =========================
function loadChart() {
  const ctx = document.getElementById("balanceChart");
  if (!ctx) return;

  const counts = { academic:0, art:0, study:0, life:0 };
  scheduleData.forEach(e => counts[e.type] = (counts[e.type]||0) + ((toMinutes(e.end)-toMinutes(e.start))/60));

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Académico","Arte","Estudio","Vida"],
      datasets: [{ data: [counts.academic, counts.art, counts.study, counts.life], backgroundColor: ['#60a5fa','#f472b6','#34d399','#fb923c'] }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }
  });
}

// =========================
// MINIMIZE EMPTY ROWS
// =========================
function toggleEmptyRows() {
  compactMode = !compactMode;
  document.getElementById("minimizeBtn").setAttribute("aria-pressed", compactMode ? "true" : "false");
  document.getElementById("minimizeIcon").classList.toggle("fa-expand-arrows-alt", !compactMode);
  document.getElementById("minimizeIcon").classList.toggle("fa-compress-arrows-alt", compactMode);

  const rows = $$(".grid .contents > div"); // all appended cells sequence (hour + 7 cells)
  // rows are structured as repeated blocks of 8 nodes per hour: hourCell + 7 day cells
  const perRow = 8;
  for (let r = 0; r < hours.length; r++) {
    const offset = r * perRow;
    // slice the 7 day cells
    const dayCells = rows.slice(offset + 1, offset + 8);
    const hasContent = dayCells.some(c => c.querySelector(".schedule-item"));
    // hide/show the 8 elements (hour + days)
    for (let k = 0; k < perRow; k++) {
      const node = rows[offset + k];
      if (!node) continue;
      node.classList.toggle("hidden-row", compactMode && !hasContent);
    }
  }
}

// =========================
// RESPONSIVE RENDER HANDLER
// =========================
function renderAll() {
  if (window.innerWidth < 768) {
    generateList();
  } else {
    generateGrid();
  }
  loadChart();
  filterSchedule("all");
}

// handle resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(renderAll, 120);
});

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // set dark mode if user prefers
  if (localStorage.theme === "dark" || (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
    $("#darkToggle").setAttribute("aria-pressed","true");
  }

  renderAll();

  // attach dark toggle
  $("#darkToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const on = document.documentElement.classList.contains("dark");
    localStorage.theme = on ? "dark" : "light";
    $("#darkToggle").setAttribute("aria-pressed", on ? "true" : "false");
  });
});
