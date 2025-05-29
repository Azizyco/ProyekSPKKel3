/**
 * Mouse App Controller
 * Combines all modules for the mouse SPK functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Store criteria and alternatives data
  const mouseData = {
    criteriaNames: [
      'Harga', 
      'Garansi (bulan)', 
      'Jumlah Mode', 
      'DPI', 
      'Berat Produk (gram)', 
      'Polling Rate (Hz)', 
      'Kapasitas Baterai (mAh)'
    ],
    criteriaTypes: [], // Will be populated from form inputs
    weights: [], // Will be calculated by AHP
    alternatives: [] // Will be populated by user input
  };
  
  // Get criteria types from radio buttons
  function getCriteriaTypes() {
    const types = [];
    types.push(document.querySelector('input[name="harga-type"]:checked').value);
    types.push(document.querySelector('input[name="garansi-type"]:checked').value);
    types.push(document.querySelector('input[name="mode-type"]:checked').value);
    types.push(document.querySelector('input[name="dpi-type"]:checked').value);
    types.push(document.querySelector('input[name="weight-type"]:checked').value);
    types.push(document.querySelector('input[name="polling-type"]:checked').value);
    types.push(document.querySelector('input[name="battery-type"]:checked').value);
    return types;
  }
  
  // Initialize AHP matrix
  createComparisonMatrix(mouseData.criteriaNames);
  
  // Handle AHP calculation
  const calculateAHPButton = document.getElementById('calculateAHP');
  if (calculateAHPButton) {
    calculateAHPButton.addEventListener('click', () => {
      // Get criteria types
      mouseData.criteriaTypes = getCriteriaTypes();
      
      // Calculate AHP
      const ahpResult = calculateAHP(mouseData.criteriaNames);
      
      // Store weights
      mouseData.weights = ahpResult.weights;
      
      // Display results
      displayAHPResults(ahpResult, mouseData.criteriaNames, mouseData.criteriaTypes);
      
      // Scroll to the result
      document.getElementById('ahpResult').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Handle adding alternatives
  const addAlternativeButton = document.getElementById('addAlternative');
  if (addAlternativeButton) {
    addAlternativeButton.addEventListener('click', () => {
      const nameInput = document.getElementById('altName');
      const priceInput = document.getElementById('altPrice');
      const warrantyInput = document.getElementById('altWarranty');
      const modesInput = document.getElementById('altModes');
      const dpiInput = document.getElementById('altDPI');
      const weightInput = document.getElementById('altWeight');
      const pollingInput = document.getElementById('altPolling');
      const batteryInput = document.getElementById('altBattery');
      
      // Validate inputs
      if (!nameInput.value || !priceInput.value || !warrantyInput.value || 
          !modesInput.value || !dpiInput.value || !weightInput.value || 
          !pollingInput.value || !batteryInput.value) {
        alert('Harap isi semua kolom!');
        return;
      }
      
      // Create alternative object
      const alternative = {
        id: `alt_${Date.now()}`,
        name: nameInput.value,
        price: parseFloat(priceInput.value),
        warranty: parseFloat(warrantyInput.value),
        modes: parseFloat(modesInput.value),
        dpi: parseFloat(dpiInput.value),
        weight: parseFloat(weightInput.value),
        polling: parseFloat(pollingInput.value),
        battery: parseFloat(batteryInput.value)
      };
      
      // Add to alternatives array
      mouseData.alternatives.push(alternative);
      
      // Update alternatives list
      updateAlternativesList();
      
      // Clear inputs
      nameInput.value = '';
      priceInput.value = '';
      warrantyInput.value = '';
      modesInput.value = '';
      dpiInput.value = '';
      weightInput.value = '';
      pollingInput.value = '';
      batteryInput.value = '';
      
      // Focus on name input
      nameInput.focus();
    });
  }
  
  // Update alternatives list
  function updateAlternativesList() {
    const alternativesList = document.getElementById('alternativesList');
    if (!alternativesList) return;
    
    let html = '';
    
    if (mouseData.alternatives.length === 0) {
      html = '<p class="empty-list">Belum ada alternatif. Tambahkan alternatif menggunakan form di sebelah kiri.</p>';
    } else {
      mouseData.alternatives.forEach(alt => {
        html += `
          <div class="alternative-item" data-id="${alt.id}">
            <div class="alternative-title">${alt.name}</div>
            <div class="alternative-details">
              Harga: Rp ${alt.price.toLocaleString()} | DPI: ${alt.dpi} | Berat: ${alt.weight}g
            </div>
            <div class="alternative-actions">
              <button class="btn-detail" data-id="${alt.id}">Detail</button>
              <button class="btn-delete" data-id="${alt.id}">Hapus</button>
            </div>
          </div>
        `;
      });
    }
    
    alternativesList.innerHTML = html;
    
    // Add event listeners for detail buttons
    const detailButtons = alternativesList.querySelectorAll('.btn-detail');
    detailButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const alternative = mouseData.alternatives.find(alt => alt.id === id);
        if (alternative) {
          showAlternativeDetails(alternative);
        }
      });
    });
    
    // Add event listeners for delete buttons
    const deleteButtons = alternativesList.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        mouseData.alternatives = mouseData.alternatives.filter(alt => alt.id !== id);
        updateAlternativesList();
      });
    });
  }
  
  // Initialize alternatives list
  updateAlternativesList();
  
  // Handle SAW calculation
  const calculateSAWButton = document.getElementById('calculateSAW');
  if (calculateSAWButton) {
    calculateSAWButton.addEventListener('click', () => {
      // Validate if we have weights and alternatives
      if (mouseData.weights.length === 0) {
        alert('Harap hitung bobot kriteria terlebih dahulu!');
        return;
      }
      
      if (mouseData.alternatives.length === 0) {
        alert('Harap tambahkan alternatif terlebih dahulu!');
        return;
      }
      
      // Get criteria types
      mouseData.criteriaTypes = getCriteriaTypes();
      
      // Calculate SAW
      const sawResults = calculateSAW(
        mouseData.alternatives,
        mouseData.criteriaNames,
        mouseData.criteriaTypes,
        mouseData.weights
      );
      
      // Display results
      const displayedResults = displaySAWResults(sawResults, mouseData.criteriaNames);
      
      // Create charts
      createBarChart(displayedResults);
      createRadarChart(displayedResults, mouseData.criteriaNames, mouseData.criteriaTypes);
      
      // Scroll to the result
      document.getElementById('sawResult').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Handle PDF export
  const exportPDFButton = document.getElementById('exportPDF');
  if (exportPDFButton) {
    exportPDFButton.addEventListener('click', () => {
      // Validate if we have calculated results
      if (mouseData.weights.length === 0 || mouseData.alternatives.length === 0) {
        alert('Harap hitung ranking terlebih dahulu!');
        return;
      }
      
      // Get criteria types
      mouseData.criteriaTypes = getCriteriaTypes();
      
      // Calculate SAW again to ensure we have the latest results
      const sawResults = calculateSAW(
        mouseData.alternatives,
        mouseData.criteriaNames,
        mouseData.criteriaTypes,
        mouseData.weights
      );
      
      // Export to PDF
      exportToPDF(sawResults, mouseData.criteriaNames, mouseData.criteriaTypes, mouseData.weights);
    });
  }
  
  // Add styles for delete button
  const style = document.createElement('style');
  style.textContent = `
    .alternative-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-xs);
    }
    
    .btn-delete {
      background-color: var(--error-color);
      color: white;
      border: none;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: background-color var(--transition-speed);
    }
    
    .btn-delete:hover {
      background-color: #d3305f;
    }
    
    .empty-list {
      color: var(--text-light);
      font-style: italic;
    }
  `;
  
  document.head.appendChild(style);
});

// Preset skenario AHP untuk Mouse
const mouseScenarios = {
  price: [
    [1,   3,   3,   3,   3,   3,   3],
    [1/3, 1,   2,   2,   2,   2,   2],
    [1/3, 1/2, 1,   1,   1,   1,   1],
    [1/3, 1/2, 1,   1,   1,   1,   1],
    [1/3, 1/2, 1,   1,   1,   1,   1],
    [1/3, 1/2, 1,   1,   1,   1,   1],
    [1/3, 1/2, 1,   1,   1,   1,   1]
  ],
  durability: [
    [1,   1/3, 1,   1,   1,   1,   1/2],
    [3,   1,   3,   3,   3,   3,   3],
    [1,   1/3, 1,   1,   1,   1,   1/2],
    [1,   1/3, 1,   1,   1,   1,   1/2],
    [1,   1/3, 1,   1,   1,   1,   1/2],
    [1,   1/3, 1,   1,   1,   1,   1/2],
    [2,   1/3, 2,   2,   2,   2,   1  ]
  ],
  performance: [
    [1,   1,   1/2, 1/3, 1,   1/2, 1  ],
    [1,   1,   1/2, 1/3, 1,   1/2, 1  ],
    [2,   2,   1,   1/3, 2,   1,   2  ],
    [3,   3,   3,   1,   3,   3,   3  ],
    [1,   1,   1/2, 1/3, 1,   1/2, 1  ],
    [2,   2,   1,   1/3, 2,   1,   2  ],
    [1,   1,   1/2, 1/3, 1,   1/2, 1  ]
  ],
  battery: [
    [1,   1/2, 1,   1,   1,   1,   1/3],
    [2,   1,   2,   2,   2,   2,   1/3],
    [1,   1/2, 1,   1,   1,   1,   1/3],
    [1,   1/2, 1,   1,   1,   1,   1/3],
    [1,   1/2, 1,   1,   1,   1,   1/3],
    [1,   1/2, 1,   1,   1,   1,   1/3],
    [3,   3,   3,   3,   3,   3,   1  ]
  ],
  balanced: Array(7).fill().map(()=>Array(7).fill(1))
};

const scenarioDescriptions = {
  price: "Memprioritaskan kriteria Harga di atas kriteria lain (nilai perbandingan 5:1 terhadap kriteria lain).",
  durability: "Memprioritaskan Garansi dan Bahan (nilai 5:1), mode lain menyesuaikan.",
  performance: "Memprioritaskan DPI dan Polling Rate (nilai 5:1).",
  battery: "Memprioritaskan kapasitas baterai (nilai 5:1).",
  balanced: "Semua kriteria dianggap sama penting (nilai 1:1)."
};

document.addEventListener('DOMContentLoaded', () => {
  // Scenario dropdown logic
  const scenarioSelect = document.getElementById('ahpScenario');
  const scenarioDesc = document.getElementById('scenarioDescription');
  const loadScenarioBtn = document.getElementById('loadScenario');

  if (scenarioSelect && scenarioDesc) {
    scenarioDesc.textContent = scenarioDescriptions[scenarioSelect.value] || '';
    scenarioSelect.addEventListener('change', function() {
      scenarioDesc.textContent = scenarioDescriptions[this.value] || '';
    });
  }

  if (loadScenarioBtn && scenarioSelect) {
    loadScenarioBtn.addEventListener('click', function() {
      const preset = mouseScenarios[scenarioSelect.value];
      if (!preset) return;
      // Update matrix inputs
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const input = document.getElementById(`comparison_${i}_${j}`);
          if (input) {
            if (i === j) {
              input.value = 1;
            } else if (i < j) {
              input.value = preset[i][j];
              // Trigger change event to update reciprocal
              input.dispatchEvent(new Event('change'));
            }
          }
        }
      }
    });
  }
});