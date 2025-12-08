/* ===========================================
   UTILIDADES
=========================================== */
function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

/* ===========================================
   GENERAR GRID DEL HORARIO
=========================================== */

function generateSchedule() {
    const grid = document.getElementById("grid-content");
    grid.innerHTML = "";

    for (let i = 0; i < timeSlots.length - 1; i++) {
        const time = timeSlots[i];

        // Columna: hora
        const hourCell = document.createElement("div");
        hourCell.className = "p-2 text-center font-medium text-stone-400";
        hourCell.textContent = time;
        grid.appendChild(hourCell);

        // Celdas por día 0-6
        for (let day = 0; day < 7; day++) {
            const cell = document.createElement("div");
            cell.className = "relative p-1 h-12";

            // Buscar si hay un evento exacto en este slot
            const event = scheduleEvents.find(ev =>
                ev.day === day &&
                ev.start === time
            );

            if (event) {
                const minutes = timeToMinutes(event.end) - timeToMinutes(event.start);
                const slots = minutes / 30;

                const block = document.createElement("div");
                const cat = categories[event.cat];

                block.className = `
                    ${cat.color} ${cat.border} ${cat.text}
                    border rounded-md p-2 text-xs cursor-pointer
                    hover:opacity-90 transition-all shadow-sm
                `;
                block.style.height = `calc(${slots} * 3rem + ${slots - 1} * 0.25rem)`;
                block.style.display = "flex";
                block.style.flexDirection = "column";
                block.style.justifyContent = "center";

                block.innerHTML = `
                    <div class="font-semibold">${event.name}</div>
                    <div class="text-[10px] opacity-70">${event.start} - ${event.end}</div>
                `;

                block.onclick = () => showDetails(event, cat);

                cell.appendChild(block);
            }

            grid.appendChild(cell);
        }
    }
}

/* ===========================================
   DETALLES DE ACTIVIDAD
=========================================== */

function showDetails(event, cat) {
    document.getElementById("detail-title").textContent = event.name;
    document.getElementById("detail-icon").innerHTML = `<i class="fas ${cat.icon}"></i>`;

    document.getElementById("detail-content").innerHTML = `
        <div class="space-y-2">
            <p><strong>Categoría:</strong> ${cat.label}</p>
            <p><strong>Horario:</strong> ${event.start} - ${event.end}</p>
            ${event.mod ? `<p><strong>Modalidad:</strong> ${event.mod}</p>` : ""}
            <p class="text-stone-600">${event.details || ""}</p>
        </div>
    `;
}

/* ===========================================
   FILTROS
=========================================== */

function filterSchedule(type) {
    document.querySelectorAll(".filter-btn").forEach(btn =>
        btn.classList.remove("active", "bg-stone-800", "text-white")
    );

    const activeBtn = document.querySelector(`[data-filter="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add("active", "bg-stone-800", "text-white");
    }

    const blocks = document.querySelectorAll("#grid-content > div > div");

    blocks.forEach(block => {
        const category = block.getAttribute("data-cat");
        if (!category) return;

        block.style.opacity = (type === "all" || category === type) ? "1" : "0.2";
    });
}

/* ===========================================
   CHART
=========================================== */

function initChart() {
    const ctx = document.getElementById("balanceChart");

    const totals = {
        academic: 0,
        study: 0,
        art: 0,
        life: 0,
        food: 0
    };

    scheduleEvents.forEach(e => {
        const mins = timeToMinutes(e.end) - timeToMinutes(e.start);
        totals[e.cat] += mins;
    });

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Académico", "Estudio", "Arte", "Vida/Ocio", "Comidas"],
            datasets: [{
                data: [
                    totals.academic,
                    totals.study,
                    totals.art,
                    totals.life,
                    totals.food
                ]
            }]
        }
    });
}

/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded", () => {
    generateSchedule();
    initChart();
});
