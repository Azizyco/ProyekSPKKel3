/**
 * AHP (Analytic Hierarchy Process) Implementation
 * This file contains functions for AHP calculation including:
 * - Matrix comparison
 * - Normalization
 * - Weight calculation
 * - Consistency check
 */

// Create the comparison matrix table
function createComparisonMatrix(criteriaNames) {
  const container = document.getElementById('matrixContainer');
  if (!container) return;
  
  let html = `
    <p class="matrix-instruction">Bandingkan kepentingan relatif antar kriteria menggunakan skala 1-9:</p>
    <ul class="matrix-scale">
      <li><strong>1</strong>: Sama penting</li>
      <li><strong>3</strong>: Sedikit lebih penting</li>
      <li><strong>5</strong>: Lebih penting</li>
      <li><strong>7</strong>: Sangat lebih penting</li>
      <li><strong>9</strong>: Mutlak lebih penting</li>
      <li><strong>2,4,6,8</strong>: Nilai tengah</li>
    </ul>
    <div class="matrix-table-container">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Kriteria</th>
            ${criteriaNames.map(name => `<th>${name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;
  
  for (let i = 0; i < criteriaNames.length; i++) {
    html += `<tr>
      <th>${criteriaNames[i]}</th>`;
    
    for (let j = 0; j < criteriaNames.length; j++) {
      if (i === j) {
        // Diagonal elements are always 1
        html += `<td><input type="text" id="comparison_${i}_${j}" value="1" disabled></td>`;
      } else if (i < j) {
        // Upper triangular elements are input fields
        html += `<td><input type="number" id="comparison_${i}_${j}" min="1" max="9" step="1" value="1" class="comparison-input"></td>`;
      } else {
        // Lower triangular elements are calculated as reciprocals
        html += `<td><input type="text" id="comparison_${i}_${j}" disabled></td>`;
      }
    }
    
    html += `</tr>`;
  }
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners to update reciprocal values
  const inputs = document.querySelectorAll('.comparison-input');
  inputs.forEach(input => {
    input.addEventListener('change', updateReciprocalValue);
  });
}

// Update reciprocal values when a comparison value changes
function updateReciprocalValue(event) {
  const inputId = event.target.id;
  const [_, i, j] = inputId.split('_').map(Number);
  
  const value = parseFloat(event.target.value);
  if (isNaN(value) || value < 1 || value > 9) {
    event.target.value = 1;
    return;
  }
  
  const reciprocalInput = document.getElementById(`comparison_${j}_${i}`);
  reciprocalInput.value = (1 / value).toFixed(3);
}

// Calculate weights using AHP
function calculateAHP(criteriaNames) {
  // Get comparison matrix values
  const n = criteriaNames.length;
  const matrix = [];
  
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      const inputElement = document.getElementById(`comparison_${i}_${j}`);
      matrix[i][j] = parseFloat(inputElement.value);
    }
  }
  
  // Calculate column sums
  const colSums = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }
  
  // Normalize matrix
  const normalizedMatrix = [];
  for (let i = 0; i < n; i++) {
    normalizedMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      normalizedMatrix[i][j] = matrix[i][j] / colSums[j];
    }
  }
  
  // Calculate weights (average of normalized rows)
  const weights = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += normalizedMatrix[i][j];
    }
    weights[i] = sum / n;
  }
  
  // Calculate consistency
  const { CI, CR, lambda } = calculateConsistency(matrix, weights, n);
  
  // Return results
  return {
    weights,
    normalizedMatrix,
    CI,
    CR,
    lambda,
    consistent: CR < 0.1
  };
}

// Calculate consistency ratio
function calculateConsistency(matrix, weights, n) {
  // Calculate lambda max
  const lambdas = [];
  
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * weights[j];
    }
    lambdas.push(sum / weights[i]);
  }
  
  const lambda = lambdas.reduce((a, b) => a + b, 0) / n;
  
  // Calculate consistency index
  const CI = (lambda - n) / (n - 1);
  
  // Random index values for n = 1 to 10
  const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  
  // Calculate consistency ratio
  const CR = CI / (n <= 10 ? RI[n - 1] : 1.49);
  
  return { CI, CR, lambda };
}

// Display AHP results
function displayAHPResults(result, criteriaNames, criteriaTypes) {
  const resultContainer = document.getElementById('ahpResult');
  if (!resultContainer) return;
  
  let html = `
    <h3>Hasil Perhitungan Bobot Kriteria</h3>
    <div class="ahp-results-container">
      <div class="weights-container">
        <table class="weights-table">
          <thead>
            <tr>
              <th>Kriteria</th>
              <th>Bobot</th>
              <th>Tipe</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  for (let i = 0; i < criteriaNames.length; i++) {
    html += `
      <tr>
        <td>${criteriaNames[i]}</td>
        <td>${(result.weights[i] * 100).toFixed(2)}%</td>
        <td>${criteriaTypes[i] === 'benefit' ? 'Benefit' : 'Cost'}</td>
      </tr>
    `;
  }
  
  html += `
          </tbody>
        </table>
      </div>
      
      <div class="consistency-container">
        <h4>Konsistensi</h4>
        <p>Lambda Max: ${result.lambda.toFixed(4)}</p>
        <p>Consistency Index (CI): ${result.CI.toFixed(4)}</p>
        <p>Consistency Ratio (CR): ${result.CR.toFixed(4)}</p>
        <p class="consistency-status ${result.consistent ? 'consistent' : 'inconsistent'}">
          ${result.consistent 
            ? '✓ Konsisten (CR < 0.1)' 
            : '✗ Tidak Konsisten (CR ≥ 0.1). Pertimbangkan untuk merevisi perbandingan.'}
        </p>
      </div>
    </div>
  `;
  
  resultContainer.innerHTML = html;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .ahp-results-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }
    
    .weights-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .weights-table th, .weights-table td {
      padding: var(--spacing-sm);
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    
    .weights-table th {
      background-color: rgba(var(--primary-color-rgb), 0.05);
      color: var(--primary-color);
      font-weight: 500;
    }
    
    .consistency-status {
      font-weight: 700;
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-sm);
    }
    
    .consistency-status.consistent {
      color: var(--success-color);
      background-color: rgba(6, 214, 160, 0.1);
    }
    
    .consistency-status.inconsistent {
      color: var(--error-color);
      background-color: rgba(239, 71, 111, 0.1);
    }
    
    @media screen and (max-width: 768px) {
      .ahp-results-container {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(style);
}