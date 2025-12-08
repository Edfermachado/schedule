// =======================================
// 1. CONFIGURACIÓN DE HORARIO SEMANAL
// =======================================

// Días de la semana
const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Intervalos de tiempo
const hours = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00"
];

// Tus actividades (ejemplo)
const scheduleData = [
    { day: 1, hour: "08:00", title: "Cálculo III", type: "academic", icon: "🎓", desc: "Clase de Cálculo" },
    { day: 2, hour: "10:00", title: "Estructuras de Datos", type: "academic", icon: "🎓" },
    { day: 0, hour: "17:00", title: "Teatro", type: "art", icon: "🎭" },
    { day: 3, hour: "14:00", title: "Estudio IA", type: "study", icon: "📚" },
    { day: 5, hour: "18:00", title: "Gimnasio", type: "life", icon: "🧘" },
];


// Crear color bonito dinámico por categoría
const colors = {
    academic: "bg-blue-200 text-blue-900",
    art: "bg-rose-200 text-rose-900",
    study: "bg-emerald-200 text-emerald-900",
    life: "bg-orange-200 text-orange-900",
};


// =======================================
// 2. GENERAR GRILLA SEMANAL
// =======================================

function generateGrid() {
    const grid = document.getElementById("grid-content");
    grid.innerHTML = "";

    hours.forEach(hour => {
        // Columna de la hora
        const hourCell = document.createElement("div");
        hourCell.className = "border p-2 bg-white font-semibold";
        hourCell.textContent = hour;
        grid.appendChild(hourCell);

        // 7 días
        for (let d = 0; d < 7; d++) {
            const cell = document.createElement("div");
            cell.className = "border p-1 min-h-[50px] relative bg-stone-100";

            const item = scheduleData.find(e => e.day === d && e.hour === hour);

            if (item) {
                cell.innerHTML = `
                    <div class="schedule-item ${colors[item.type]} p-1 rounded text-[10px] cursor-pointer"
                        data-title="${item.title}"
                        data-type="${item.type}"
                        data-icon="${item.icon}"
                        data-desc="${item.desc || "Sin descripción"}">
                        ${item.icon} ${item.title}
                    </div>
                `;
            }

            grid.appendChild(cell);
        }
    });

    enableDetails();
}


// =======================================
// 3. SISTEMA DE DETALLES (panel derecho)
// =======================================

function enableDetails() {
    const items = document.querySelectorAll(".schedule-item");
    const detailTitle = document.getElementById("detail-title");
    const detailContent = document.getElementById("detail-content");
    const detailIcon = document.getElementById("detail-icon");

    items.forEach(item => {
        item.addEventListener("click", () => {
            detailTitle.textContent = item.dataset.title;
            detailIcon.textContent = item.dataset.icon;
            detailContent.innerHTML = `
                <p class="text-sm mb-2">${item.dataset.desc}</p>
                <span class="px-2 py-1 rounded text-xs ${colors[item.dataset.type]}">
                    Categoría: ${item.dataset.type}
                </span>
            `;
        });
    });
}


// =======================================
// 4. FILTROS DE CATEGORÍA
// =======================================

function filterSchedule(type) {
    const items = document.querySelectorAll(".schedule-item");
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-filter="${type}"]`)?.classList.add("active");

    items.forEach(item => {
        if (type === "all" || item.dataset.type === type) {
            item.style.opacity = "1";
        } else {
            item.style.opacity = "0.1";
        }
    });
}


// =======================================
// 5. CHART PRINCIPAL: balanceChart
// =======================================

function loadChart() {
    const ctx = document.getElementById("balanceChart");
    if (!ctx) return;

    // Contar actividades por categoría
    const counts = {
        academic: 0,
        art: 0,
        study: 0,
        life: 0
    };

    scheduleData.forEach(item => counts[item.type]++);

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


// =======================================
// 6. SMOOTH SCROLL DE NAVBAR
// =======================================

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}


// =======================================
// 7. INICIALIZACIÓN
// =======================================

document.addEventListener("DOMContentLoaded", () => {
    generateGrid();
    loadChart();
    filterSchedule("all");
});
