// =====================
// 1. Configuración base
// =====================

// Intervalos de tiempo (ejemplo)
const timeSlots = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00"
];

// Generar colores aleatorios tipo Tailwind
function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 90%, 70%)`;
}

// =====================
// 2. Generar horario
// =====================

function generateSchedule() {
    const scheduleContainer = document.getElementById("schedule");
    if (!scheduleContainer) return;

    scheduleContainer.innerHTML = "";

    timeSlots.forEach(time => {
        const slot = document.createElement("div");
        slot.className = "p-4 rounded-xl mb-3 flex items-center justify-between bg-gray-800 text-white";

        slot.innerHTML = `
            <span class="font-bold text-lg">${time}</span>
            <span class="px-3 py-1 rounded-lg text-sm" style="background:${randomColor()}">
                Disponible
            </span>
        `;

        scheduleContainer.appendChild(slot);
    });
}

// =====================
// 3. Charts (Chart.js)
// =====================

function generateCharts() {
    const ctx = document.getElementById("hoursChart");
    if (!ctx) return; // evita error en páginas donde no exista

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: timeSlots,
            datasets: [{
                label: "Horas ocupadas",
                data: timeSlots.map(() => Math.floor(Math.random() * 2)), // datos demo
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// =====================
// 4. Share Modal
// =====================

function setupShareModal() {
    const openBtn = document.getElementById("open-share");
    const closeBtn = document.getElementById("close-share");
    const modal = document.getElementById("share-modal");

    if (!openBtn || !closeBtn || !modal) return;

    openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

// =====================
// 5. Inicialización
// =====================

document.addEventListener("DOMContentLoaded", () => {
    generateSchedule();
    generateCharts();
    setupShareModal();
});
