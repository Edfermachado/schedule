// =========================
// CONFIG
// =========================

const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const hours = [
    "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00"
];

// HORARIO REAL
const scheduleData = [
    { day: 0, start: "13:00", end: "17:00", title: "Teatro", type: "art", icon: "🎭" },

    { day: 1, start: "17:00", end: "19:00", title: "Lenguaje de Programación", type: "academic", icon: "💻" },

    { day: 2, start: "07:30", end: "10:30", title: "Probabilidad", type: "academic", icon: "🔢" },
    { day: 2, start: "15:00", end: "16:30", title: "Inglés", type: "academic", icon: "🇬🇧" },

    { day: 3, start: "10:30", end: "12:00", title: "Metodología", type: "academic", icon: "📝" },

    { day: 4, start: "07:30", end: "10:30", title: "Probabilidad", type: "academic", icon: "🔢" },
    { day: 4, start: "15:00", end: "16:30", title: "Inglés", type: "academic", icon: "🇬🇧" },
    { day: 4, start: "18:00", end: "20:00", title: "Ingeniería de Software", type: "academic", icon: "💻" },

    { day: 6, start: "08:30", end: "12:00", title: "Redes I", type: "academic", icon: "🌐" }
];

// Colores por categoría
const colors = {
    academic: "bg-blue-200 text-blue-900",
    art: "bg-rose-200 text-rose-900",
    study: "bg-emerald-200 text-emerald-900",
    life: "bg-orange-200 text-orange-900",
};


// =========================
// GRID
// =========================

function generateGrid() {
    const grid = document.getElementById("grid-content");
    grid.innerHTML = "";

    hours.forEach(h => {
        // Fila completa = 1 hora + 7 días
        const row = document.createElement("div");
        row.className = "schedule-row contents"; // marca para minimizado

        // Columna de hora
        const hourCell = document.createElement("div");
        hourCell.className = "border p-2 font-semibold text-center bg-[var(--card-bg)]";
        hourCell.textContent = h;
        row.appendChild(hourCell);

        // 7 días
        for (let d = 0; d < 7; d++) {
            const cell = document.createElement("div");
            cell.className = "border min-h-[40px] relative schedule-block";

            const item = scheduleData.find(e => e.day === d && e.start === h);

            if (item) {
                const div = document.createElement("div");
                div.className = `schedule-item absolute inset-0 flex items-center justify-center text-xs p-1 ${colors[item.type]}`;
                div.textContent = `${item.icon} ${item.title}`;
                div.dataset.title = item.title;
                div.dataset.type = item.type;
                div.dataset.icon = item.icon;
                div.dataset.desc = item.title;

                cell.appendChild(div);
            }

            row.appendChild(cell);
        }

        grid.appendChild(row);
    });

    enableDetails();
}


// =========================
// DETALLES
// =========================

function enableDetails() {
    const items = document.querySelectorAll(".schedule-item");
    const detail = document.getElementById("detail-content");

    items.forEach(item => {
        item.addEventListener("click", () => {
            detail.innerHTML = `
                <h3 class="font-semibold text-lg mb-2">${item.dataset.icon} ${item.dataset.title}</h3>
                <p>Categoría: <b>${item.dataset.type}</b></p>
            `;
        });
    });
}


// =========================
// FILTRADO
// =========================

function filterSchedule(type) {
    const items = document.querySelectorAll(".schedule-item");

    items.forEach(it => {
        it.style.opacity =
            type === "all" || it.dataset.type === type ? "1" : ".15";
    });
}


// =========================
// CHART
// =========================

function loadChart() {
    const ctx = document.getElementById("balanceChart");
    const counts = { academic: 0, art: 0, study: 0, life: 0 };

    scheduleData.forEach(e => counts[e.type]++);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Académico", "Arte", "Estudio", "Vida"],
            datasets: [{
                data: [
                    counts.academic,
                    counts.art,
                    counts.study,
                    counts.life
                ]
            }]
        },
        options: { responsive: true }
    });
}


// =========================
// MINIMIZAR BLOQUES VACÍOS
// =========================

let compactMode = false;

function toggleEmptyRows() {
    compactMode = !compactMode;

    const rows = document.querySelectorAll(".schedule-row");

    rows.forEach(row => {
        const blocks = row.querySelectorAll(".schedule-block");
        const hasContent = [...blocks].some(b =>
            b.querySelector(".schedule-item")
        );

        if (!hasContent) {
            row.classList.toggle("hidden-row", compactMode);
        }
    });
}


// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", () => {
    generateGrid();
    loadChart();
    filterSchedule("all");
});

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
