/**
 * Keyboard App Controller
 * Combines all modules for the keyboard SPK functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Store criteria and alternatives data
  const keyboardData = {
    criteriaNames: [
      'Harga', 
      'Garansi (bulan)', 
      'Jumlah Mode', 
      'Kapasitas Baterai (mAh)', 
      'Ukuran Layout (%)', 
      'Jumlah Fitur Tambahan', 
      'Bahan Keyboard'
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
    types.push(document.querySelector('input[name="battery-type"]:checked').value);
    types.push(document.querySelector('input[name="layout-type"]:checked').value);
    types.push(document.querySelector('input[name="features-type"]:checked').value);
    types.push(document.querySelector('input[name="material-type"]:checked').value);
    return types;
  }
  
  // Initialize AHP matrix
  createComparisonMatrix(keyboardData.criteriaNames);
  
  // Handle AHP calculation
  const calculateAHPButton = document.getElementById('calculateAHP');
  if (calculateAHPButton) {
    calculateAHPButton.addEventListener('click', () => {
      // Get criteria types
      keyboardData.criteriaTypes = getCriteriaTypes();
      
      // Calculate AHP
      const ahpResult = calculateAHP(keyboardData.criteriaNames);
      
      // Store weights
      keyboardData.weights = ahpResult.weights;
      
      // Display results
      displayAHPResults(ahpResult, keyboardData.criteriaNames, keyboardData.criteriaTypes);
      
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
      const batteryInput = document.getElementById('altBattery');
      const layoutInput = document.getElementById('altLayout');
      const featuresInput = document.getElementById('altFeatures');
      const materialInput = document.getElementById('altMaterial');
      
      // Validate inputs
      if (!nameInput.value || !priceInput.value || !warrantyInput.value || 
          !modesInput.value || !batteryInput.value || !featuresInput.value) {
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
        battery: parseFloat(batteryInput.value),
        layout: parseFloat(layoutInput.value),
        features: parseFloat(featuresInput.value),
        material: parseFloat(materialInput.value)
      };
      
      // Add to alternatives array
      keyboardData.alternatives.push(alternative);
      
      // Update alternatives list
      updateAlternativesList();
      
      // Clear inputs
      nameInput.value = '';
      priceInput.value = '';
      warrantyInput.value = '';
      modesInput.value = '';
      batteryInput.value = '';
      layoutInput.value = '100';
      featuresInput.value = '';
      materialInput.value = '2';
      
      // Focus on name input
      nameInput.focus();
    });
  }
  
  // Update alternatives list
  function updateAlternativesList() {
    const alternativesList = document.getElementById('alternativesList');
    if (!alternativesList) return;
    
    let html = '';
    
    if (keyboardData.alternatives.length === 0) {
      html = '<p class="empty-list">Belum ada alternatif. Tambahkan alternatif menggunakan form di sebelah kiri.</p>';
    } else {
      keyboardData.alternatives.forEach(alt => {
        // Format material display
        const materials = ['Plastik Biasa', 'ABS Plastik', 'Kombinasi ABS+Metal', 'PBT', 'Aluminium Full Body'];
        const materialDisplay = materials[alt.material - 1] || '';
        
        html += `
          <div class="alternative-item" data-id="${alt.id}">
            <div class="alternative-title">${alt.name}</div>
            <div class="alternative-details">
              Harga: Rp ${alt.price.toLocaleString()} | Layout: ${alt.layout}% | Bahan: ${materialDisplay}
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
        const alternative = keyboardData.alternatives.find(alt => alt.id === id);
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
        keyboardData.alternatives = keyboardData.alternatives.filter(alt => alt.id !== id);
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
      if (keyboardData.weights.length === 0) {
        alert('Harap hitung bobot kriteria terlebih dahulu!');
        return;
      }
      
      if (keyboardData.alternatives.length === 0) {
        alert('Harap tambahkan alternatif terlebih dahulu!');
        return;
      }
      
      // Get criteria types
      keyboardData.criteriaTypes = getCriteriaTypes();
      
      // Calculate SAW
      const sawResults = calculateSAW(
        keyboardData.alternatives,
        keyboardData.criteriaNames,
        keyboardData.criteriaTypes,
        keyboardData.weights
      );
      
      // Display results
      const displayedResults = displaySAWResults(sawResults, keyboardData.criteriaNames);
      
      // Create charts
      createBarChart(displayedResults);
      createRadarChart(displayedResults, keyboardData.criteriaNames, keyboardData.criteriaTypes);
      
      // Scroll to the result
      document.getElementById('sawResult').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Handle PDF export
  const exportPDFButton = document.getElementById('exportPDF');
  if (exportPDFButton) {
    exportPDFButton.addEventListener('click', () => {
      // Validate if we have calculated results
      if (keyboardData.weights.length === 0 || keyboardData.alternatives.length === 0) {
        alert('Harap hitung ranking terlebih dahulu!');
        return;
      }
      
      // Get criteria types
      keyboardData.criteriaTypes = getCriteriaTypes();
      
      // Calculate SAW again to ensure we have the latest results
      const sawResults = calculateSAW(
        keyboardData.alternatives,
        keyboardData.criteriaNames,
        keyboardData.criteriaTypes,
        keyboardData.weights
      );
      
      // Export to PDF
      exportToPDF(sawResults, keyboardData.criteriaNames, keyboardData.criteriaTypes, keyboardData.weights);
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