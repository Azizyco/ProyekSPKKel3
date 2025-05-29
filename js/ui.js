// Check for saved theme preference or use system preference
document.addEventListener('DOMContentLoaded', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Add animation class
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 500);
    });
  }
  
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  var contentHeaderSidebarToggle = document.getElementById('contentHeaderSidebarToggle');
  if (contentHeaderSidebarToggle && sidebar) {
    contentHeaderSidebarToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          e.target !== sidebarToggle) {
        sidebar.classList.remove('active');
      }
    });
  }
  
  // Modal functionality
  const modalClose = document.querySelector('.modal-close');
  const modal = document.getElementById('alternativeModal');
  
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Handle print button
  const printButton = document.getElementById('printResult');
  if (printButton) {
    printButton.addEventListener('click', () => {
      window.print();
    });
  }
});

// Show alternative details in modal
function showAlternativeDetails(alternative) {
  const modal = document.getElementById('alternativeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  if (modal && modalTitle && modalBody) {
    modalTitle.textContent = alternative.name;
    
    let content = '';
    for (const [key, value] of Object.entries(alternative)) {
      if (key !== 'name' && key !== 'id') {
        const label = formatCriteriaName(key);
        content += `<div class="modal-detail-item">
                      <strong>${label}:</strong> ${formatCriteriaValue(key, value)}
                    </div>`;
      }
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
  }
}

// Format criteria name for display
function formatCriteriaName(key) {
  const nameMap = {
    price: 'Harga',
    warranty: 'Garansi',
    modes: 'Jumlah Mode',
    dpi: 'DPI',
    weight: 'Berat Produk',
    polling: 'Polling Rate',
    battery: 'Kapasitas Baterai',
    layout: 'Ukuran Layout',
    features: 'Jumlah Fitur',
    material: 'Bahan Keyboard'
  };
  
  return nameMap[key] || key;
}

// Format criteria value for display
function formatCriteriaValue(key, value) {
  if (key === 'price') {
    return `Rp ${value.toLocaleString()}`;
  } else if (key === 'warranty') {
    return `${value} bulan`;
  } else if (key === 'dpi') {
    return `${value} DPI`;
  } else if (key === 'weight') {
    return `${value} gram`;
  } else if (key === 'polling') {
    return `${value} Hz`;
  } else if (key === 'battery') {
    return `${value} mAh`;
  } else if (key === 'layout') {
    return `${value}%`;
  } else if (key === 'material') {
    const materials = ['Plastik Biasa', 'ABS Plastik', 'Kombinasi ABS+Metal', 'PBT', 'Aluminium Full Body'];
    return materials[value - 1] || value;
  }
  
  return value;
}