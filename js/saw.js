/**
 * SAW (Simple Additive Weighting) Implementation
 * This file contains functions for SAW calculation including:
 * - Normalization of alternative values
 * - Calculation of final scores
 * - Ranking of alternatives
 */

// Normalize values based on criteria type
function normalizeValues(alternatives, criteriaNames, criteriaTypes) {
  const normalizedValues = [];
  
  // For each criteria
  for (let j = 0; j < criteriaNames.length; j++) {
    const criteriaName = criteriaNames[j].toLowerCase().replace(/\s+/g, '');
    const criteriaType = criteriaTypes[j];
    
    let key;
    switch (criteriaName) {
      case 'harga': key = 'price'; break;
      case 'garansi(bulan)': key = 'warranty'; break;
      case 'jumlahmode': key = 'modes'; break;
      case 'dpi': key = 'dpi'; break;
      case 'beratproduk(gram)': key = 'weight'; break;
      case 'pollingrate(hz)': key = 'polling'; break;
      case 'kapasitasbaterai(mah)': key = 'battery'; break;
      case 'ukuranlayout(%)': key = 'layout'; break;
      case 'jumlahfiturtambahan': key = 'features'; break;
      case 'bahankeyboard': key = 'material'; break;
      default: key = criteriaName;
    }
    
    // Find min and max values for this criteria
    let min = Infinity;
    let max = -Infinity;
    
    alternatives.forEach(alt => {
      if (alt[key] < min) min = alt[key];
      if (alt[key] > max) max = alt[key];
    });
    
    // Normalize values
    alternatives.forEach((alt, i) => {
      if (!normalizedValues[i]) normalizedValues[i] = {};
      
      if (criteriaType === 'benefit') {
        // For benefit criteria: normalized = value / max
        normalizedValues[i][key] = alt[key] / max;
      } else {
        // For cost criteria: normalized = min / value
        normalizedValues[i][key] = min / alt[key];
      }
    });
  }
  
  return normalizedValues;
}

// Calculate SAW scores and rankings
function calculateSAW(alternatives, criteriaNames, criteriaTypes, weights) {
  // Normalize values
  const normalizedValues = normalizeValues(alternatives, criteriaNames, criteriaTypes);
  
  // Calculate scores
  const scores = [];
  
  alternatives.forEach((alt, i) => {
    let score = 0;
    
    // For each criteria
    for (let j = 0; j < criteriaNames.length; j++) {
      const criteriaName = criteriaNames[j].toLowerCase().replace(/\s+/g, '');
      
      let key;
      switch (criteriaName) {
        case 'harga': key = 'price'; break;
        case 'garansi(bulan)': key = 'warranty'; break;
        case 'jumlahmode': key = 'modes'; break;
        case 'dpi': key = 'dpi'; break;
        case 'beratproduk(gram)': key = 'weight'; break;
        case 'pollingrate(hz)': key = 'polling'; break;
        case 'kapasitasbaterai(mah)': key = 'battery'; break;
        case 'ukuranlayout(%)': key = 'layout'; break;
        case 'jumlahfiturtambahan': key = 'features'; break;
        case 'bahankeyboard': key = 'material'; break;
        default: key = criteriaName;
      }
      
      // Add weighted normalized value to score
      score += normalizedValues[i][key] * weights[j];
    }
    
    scores.push({
      id: alt.id,
      name: alt.name,
      score: score,
      values: { ...alt },
      normalizedValues: { ...normalizedValues[i] }
    });
  });
  
  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);
  
  // Add rankings
  scores.forEach((item, i) => {
    item.rank = i + 1;
  });
  
  return scores;
}

// Display SAW results
function displaySAWResults(results, criteriaNames) {
  const resultContainer = document.getElementById('sawResult');
  if (!resultContainer) return;
  
  let html = `
    <h3>Peringkat Alternatif</h3>
    <div class="saw-table-container">
      <table class="saw-table">
        <thead>
          <tr>
            <th>Peringkat</th>
            <th>Nama</th>
            <th>Skor</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  results.forEach(result => {
    html += `
      <tr data-id="${result.id}">
        <td class="saw-rank">${result.rank}</td>
        <td>${result.name}</td>
        <td class="saw-score">${result.score.toFixed(4)}</td>
        <td><button class="btn-detail" data-id="${result.id}">Detail</button></td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  resultContainer.innerHTML = html;
  
  // Add event listeners for detail buttons
  const detailButtons = resultContainer.querySelectorAll('.btn-detail');
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const alternative = results.find(r => r.id === id);
      if (alternative) {
        showAlternativeDetails(alternative.values);
      }
    });
  });
  
  // Add styles for the detail button
  const style = document.createElement('style');
  style.textContent = `
    .btn-detail {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: background-color var(--transition-speed);
    }
    
    .btn-detail:hover {
      background-color: var(--primary-dark);
    }
  `;
  
  document.head.appendChild(style);
  
  return results;
}