/**
 * Chart Visualization Functions
 * Uses Chart.js to create:
 * - Bar chart for top 5 alternatives
 * - Radar chart for comparing products
 */

// Create bar chart for top alternatives
function createBarChart(results) {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;
  
  // Get top 5 results (or fewer if less than 5 available)
  const topResults = results.slice(0, Math.min(5, results.length));
  
  // Create chart data
  const labels = topResults.map(r => r.name);
  const scores = topResults.map(r => r.score);
  
  // Destroy existing chart if it exists
  if (window.barChartInstance) {
    window.barChartInstance.destroy();
  }
  
  // Create chart
  window.barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Skor',
        data: scores,
        backgroundColor: [
          'rgba(51, 102, 204, 0.8)',  // Primary
          'rgba(0, 168, 150, 0.8)',   // Secondary
          'rgba(242, 100, 25, 0.8)',  // Accent
          'rgba(6, 214, 160, 0.8)',   // Success
          'rgba(255, 209, 102, 0.8)'  // Warning
        ],
        borderColor: [
          'rgba(51, 102, 204, 1)',
          'rgba(0, 168, 150, 1)',
          'rgba(242, 100, 25, 1)',
          'rgba(6, 214, 160, 1)',
          'rgba(255, 209, 102, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            callback: function(value) {
              return value.toFixed(2);
            }
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Top 5 Alternatif Berdasarkan Skor',
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Skor: ${context.raw.toFixed(4)}`;
            }
          }
        }
      }
    }
  });
}

// Create radar chart comparing best product vs ideal
function createRadarChart(results, criteriaNames, criteriaTypes) {
  const ctx = document.getElementById('radarChart');
  if (!ctx || results.length === 0) return;
  
  // Get the best product (first in ranking)
  const bestProduct = results[0];
  
  // Create labels for criteria
  const labels = criteriaNames.map(formatCriteriaNameForChart);
  
  // Create datasets
  const bestProductData = [];
  const idealData = [];

  // Hitung rata-rata tiap kriteria dari seluruh alternatif
  const avgByCriteria = {};
  criteriaNames.forEach((name, i) => {
    const key = getCriteriaKey(name);
    let sum = 0;
    results.forEach(r => {
      sum += r.normalizedValues[key];
    });
    avgByCriteria[key] = sum / results.length;
  });

  // Fill datasets
  criteriaNames.forEach((name, i) => {
    const key = getCriteriaKey(name);
    bestProductData.push(bestProduct.normalizedValues[key]);
    idealData.push(avgByCriteria[key]); // Ideal diubah menjadi rata-rata alternatif
  });
  
  // Destroy existing chart if it exists
  if (window.radarChartInstance) {
    window.radarChartInstance.destroy();
  }
  
  // Create chart
  window.radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: bestProduct.name,
          data: bestProductData,
          backgroundColor: 'rgba(51, 102, 204, 0.2)',
          borderColor: 'rgba(51, 102, 204, 1)',
          pointBackgroundColor: 'rgba(51, 102, 204, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(51, 102, 204, 1)'
        },
        {
          label: 'Ideal',
          data: idealData,
          backgroundColor: 'rgba(242, 100, 25, 0.2)',
          borderColor: 'rgba(242, 100, 25, 1)',
          pointBackgroundColor: 'rgba(242, 100, 25, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(242, 100, 25, 1)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 2
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 1
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Perbandingan Produk Terbaik vs Ideal',
          font: {
            size: 16
          }
        }
      }
    }
  });
}

// Format criteria name for chart display
function formatCriteriaNameForChart(name) {
  // Make the name shorter for display in chart
  let formattedName = name;
  
  // Remove units in parentheses
  formattedName = formattedName.replace(/\([^)]*\)/g, '');
  
  return formattedName.trim();
}

// Get criteria key from name
function getCriteriaKey(name) {
  const criteriaName = name.toLowerCase().replace(/\s+/g, '');
  
  switch (criteriaName) {
    case 'harga': return 'price';
    case 'garansi(bulan)': return 'warranty';
    case 'jumlahmode': return 'modes';
    case 'dpi': return 'dpi';
    case 'beratproduk(gram)': return 'weight';
    case 'pollingrate(hz)': return 'polling';
    case 'kapasitasbaterai(mah)': return 'battery';
    case 'ukuranlayout(%)': return 'layout';
    case 'jumlahfiturtambahan': return 'features';
    case 'bahankeyboard': return 'material';
    default: return criteriaName;
  }
}