/**
 * Módulo de Gestión del Gráfico de Distribución
 * Maneja la creación y actualización del gráfico circular
 */

import { getCategoryDistribution } from './dataManager.js';

let chartInstance = null;

const categoryLabels = {
  academic: 'Académico',
  art: 'Arte',
  study: 'Estudio',
  life: 'Vida'
};

const categoryColors = {
  academic: '#3b82f6',
  art: '#f472b6',
  study: '#10b981',
  life: '#f59e0b'
};

/**
 * Inicializa el gráfico de distribución
 */
export function initChart(canvasElement) {
  if (!canvasElement || typeof Chart === 'undefined') {
    console.error('Canvas no disponible o Chart.js no cargado');
    return null;
  }
  
  const ctx = canvasElement.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: getChartData(),
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(1)} hrs`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });
  
  return chartInstance;
}

/**
 * Obtiene los datos formateados para el gráfico
 */
function getChartData() {
  const distribution = getCategoryDistribution();
  
  const labels = [];
  const data = [];
  const backgroundColor = [];
  
  Object.keys(distribution).forEach(key => {
    if (distribution[key] > 0) {
      labels.push(categoryLabels[key]);
      data.push(distribution[key]);
      backgroundColor.push(categoryColors[key]);
    }
  });
  
  // Si no hay datos, mostrar valores por defecto
  if (data.length === 0) {
    labels.push('Sin actividades');
    data.push(1);
    backgroundColor.push('#94a3b8');
  }
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor,
      borderWidth: 0,
      hoverOffset: 10
    }]
  };
}

/**
 * Actualiza el gráfico con los datos más recientes
 */
export function updateChart() {
  if (!chartInstance) return;
  
  const newData = getChartData();
  
  chartInstance.data.labels = newData.labels;
  chartInstance.data.datasets[0].data = newData.data;
  chartInstance.data.datasets[0].backgroundColor = newData.backgroundColor;
  chartInstance.update('active');
}

/**
 * Destruye la instancia del gráfico (útil para limpiar)
 */
export function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}
