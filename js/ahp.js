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
  // Add row for column sums
  html += `<tr><th>Jumlah</th>`;
  for (let j = 0; j < criteriaNames.length; j++) {
    html += `<td id="colSum_${j}">0</td>`;
  }
  html += `</tr>`;
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Function to update column sums
  function updateColSums() {
    const n = criteriaNames.length;
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const input = document.getElementById(`comparison_${i}_${j}`);
        sum += parseFraction(input.value);
      }
      document.getElementById(`colSum_${j}`).textContent = sum.toFixed(3);
    }
  }
  
  // Add event listeners to update reciprocal values and column sums
  const inputs = document.querySelectorAll('.comparison-input');
  inputs.forEach(input => {
    input.addEventListener('change', function(e) {
      updateReciprocalValue(e);
      updateColSums();
    });
  });
  // Initial update
  updateColSums();
}

// Update reciprocal values when a comparison value changes
function updateReciprocalValue(event) {
  const inputId = event.target.id;
  const [_, i, j] = inputId.split('_').map(Number);
  
  let valueStr = event.target.value;
  let value = parseFraction(valueStr);
  if (isNaN(value) || value <= 0) {
    event.target.value = 1;
    value = 1;
  }
  
  const reciprocalInput = document.getElementById(`comparison_${j}_${i}`);
  reciprocalInput.value = (1 / value).toFixed(3);
}

// Parse input as fraction if needed
function parseFraction(str) {
  if (typeof str !== 'string') return NaN;
  str = str.trim();
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const denom = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
        return num / denom;
      }
    }
    return NaN;
  }
  return parseFloat(str);
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
      matrix[i][j] = parseFraction(inputElement.value);
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
    matrix,
    CI,
    CR,
    lambda,
    consistent: CR < 0.1
  };
}

// Calculate consistency ratio
function calculateConsistency(matrix, weights, n) {
  // Hitung eigen value total (lambda) sesuai tabel normalisasi
  let eigenSum = 0;
  for (let i = 0; i < n; i++) {
    let rowSumMatrix = 0;
    for (let j = 0; j < n; j++) {
      rowSumMatrix += matrix[j][i];
    }
    eigenSum += weights[i] * rowSumMatrix;
  }
  const lambda = eigenSum;
  // Calculate consistency index
  const CI = (lambda - n) / (n - 1);
  // Random index values for n = 1 to 10
  const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  // Calculate consistency ratio
  const CR = CI / (n <= 10 ? RI[n - 1] : 1.32);
  return { CI, CR, lambda };
}

// Render normalization table for AHP
function renderNormalizationTable(result, criteriaNames) {
  const matrix = result.matrix;
  const n = criteriaNames.length;
  let html = ` <h4> </h4><h4>Tabel Normalisasi Matriks, Jumlah, Prioritas, dan Eigen Value</h4>`;
  html += `<div class="matrix-table-container"><table class="matrix-table"><thead><tr><th>Normalisasi</th>`;
  for (let j = 0; j < n; j++) {
    html += `<th>${criteriaNames[j]}</th>`;
  }
  html += `<th>Jumlah</th><th>Prioritas</th><th>Eigen Value</th></tr></thead><tbody>`;
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    html += `<tr><th>${criteriaNames[i]}</th>`;
    for (let j = 0; j < n; j++) {
      html += `<td>${result.normalizedMatrix[i][j].toFixed(3)}</td>`;
      rowSum += result.normalizedMatrix[i][j];
    }
    html += `<td>${rowSum.toFixed(3)}</td>`;
    html += `<td>${result.weights[i].toFixed(4)}</td>`;
    // Eigen value untuk setiap baris: prioritas (bobot) baris dikali jumlah pada matriks perbandingan baris tersebut
    let rowSumMatrix = 0;
    for (let j = 0; j < n; j++) {
      rowSumMatrix += matrix[j][i];
    }
    let eig = result.weights[i] * rowSumMatrix;
    html += `<td>${eig.toFixed(3)}</td>`;
    html += `</tr>`;
  }
  // Tambahkan penjumlahan eigen value
  let eigenSum = 0;
  for (let i = 0; i < n; i++) {
    let rowSumMatrix = 0;
    for (let j = 0; j < n; j++) {
      rowSumMatrix += matrix[j][i];
    }
    eigenSum += result.weights[i] * rowSumMatrix;
  }
  // Add sum row
  html += `<tr><th>Jumlah</th>`;
  for (let j = 0; j < n; j++) {
    let colSum = 0;
    for (let i = 0; i < n; i++) {
      colSum += result.normalizedMatrix[i][j];
    }
    html += `<td>${colSum.toFixed(3)}</td>`;
  }
  html += `<td>${n}</td><td>1</td><td>${eigenSum.toFixed(3)}</td></tr>`;
  html += `</tbody></table></div>`;
  // Tambahkan keterangan bahwa jumlah eigen value adalah lambda
  html += `<div style='margin-top:8px;font-style:italic;color:#555;'>Jumlah total eigen value = ${eigenSum.toFixed(3)} adalah Lambda (\u03BB<sub>max</sub>)</div>`;
  return html;
}

// Display AHP results
function displayAHPResults(result, criteriaNames, criteriaTypes) {
  // Render normalization table
  renderNormalizationTable(result, criteriaNames);

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
        <p>Lambda Max: ${result.lambda.toFixed(3)}</p>
        <p>Consistency Index (CI): ${result.CI.toFixed(3)}</p>
        <p>Consistency Ratio (CR): ${result.CR.toFixed(3)}</p>
        <p class="consistency-status ${result.consistent ? 'consistent' : 'inconsistent'}">
          ${result.consistent 
            ? '✓ Konsisten (CR < 0.1)' 
            : '✗ Tidak Konsisten (CR ≥ 0.1). Pertimbangkan untuk merevisi perbandingan.'}
        </p>
      </div>
    </div>
  `;
  
  resultContainer.innerHTML = html;
  
  // Add normalization table below weights and consistency
  const normalizationTable = document.getElementById('normalizationTable');
  if (normalizationTable) {
    normalizationTable.remove();
  }
  const normDiv = document.createElement('div');
  normDiv.id = 'normalizationTable';
  normDiv.innerHTML = renderNormalizationTable(result, criteriaNames);
  resultContainer.appendChild(normDiv);

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