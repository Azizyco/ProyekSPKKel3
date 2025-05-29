/**
 * Export Functions
 * This file contains functions for:
 * - Exporting results to PDF
 * - Print-friendly formatting
 */

// Export results to PDF
function exportToPDF(results, criteriaNames, criteriaTypes, weights) {
  // Check if jsPDF is available
  if (typeof jspdf === 'undefined') {
    alert('PDF export library not loaded. Please try again later.');
    return;
  }
  
  // Create new PDF document
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: 'Laporan SPK Mouse & Keyboard',
    subject: 'Hasil Perhitungan SPK',
    author: 'SPK Mouse & Keyboard',
    keywords: 'SPK, AHP, SAW, Mouse, Keyboard',
    creator: 'SPK Mouse & Keyboard'
  });
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(51, 102, 204); // Primary color
  doc.text('Laporan Sistem Pendukung Keputusan', 105, 20, { align: 'center' });
  
  // Add subtitle based on page
  const isMousePage = document.title.includes('Mouse');
  doc.setFontSize(14);
  doc.text(`Pemilihan ${isMousePage ? 'Mouse' : 'Keyboard'} Wireless/Bluetooth Terbaik`, 105, 30, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date();
  doc.text(`Tanggal: ${today.toLocaleDateString()}`, 105, 40, { align: 'center' });
  
  // Add criteria weights
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Bobot Kriteria', 20, 55);
  
  let y = 65;
  doc.setFontSize(10);
  
  // Create table header for criteria
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(51, 102, 204);
  doc.rect(20, y, 55, 8, 'F');
  doc.rect(75, y, 30, 8, 'F');
  doc.rect(105, y, 30, 8, 'F');
  doc.text('Kriteria', 22, y + 5.5);
  doc.text('Bobot', 77, y + 5.5);
  doc.text('Tipe', 107, y + 5.5);
  y += 8;
  
  // Add criteria rows
  doc.setTextColor(0, 0, 0);
  criteriaNames.forEach((name, i) => {
    // Create table row
    if (i % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, y, 55, 8, 'F');
      doc.rect(75, y, 30, 8, 'F');
      doc.rect(105, y, 30, 8, 'F');
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(20, y, 55, 8, 'F');
      doc.rect(75, y, 30, 8, 'F');
      doc.rect(105, y, 30, 8, 'F');
    }
    
    // Add cell content
    doc.text(name, 22, y + 5.5);
    doc.text(`${(weights[i] * 100).toFixed(2)}%`, 77, y + 5.5);
    doc.text(criteriaTypes[i] === 'benefit' ? 'Benefit' : 'Cost', 107, y + 5.5);
    
    y += 8;
  });
  
  // Add outer border to the table
  doc.setDrawColor(51, 102, 204);
  doc.setLineWidth(0.5);
  doc.rect(20, 65, 115, criteriaNames.length * 8);
  
  // Add heading for ranking results
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Hasil Peringkat', 20, y);
  y += 10;
  
  // Create table header for results
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(51, 102, 204);
  doc.rect(20, y, 15, 8, 'F');
  doc.rect(35, y, 110, 8, 'F');
  doc.rect(145, y, 35, 8, 'F');
  doc.text('Rank', 22, y + 5.5);
  doc.text('Nama', 37, y + 5.5);
  doc.text('Skor', 147, y + 5.5);
  y += 8;
  
  // Add result rows (limit to top 10)
  doc.setTextColor(0, 0, 0);
  const maxResults = Math.min(results.length, 10);
  
  for (let i = 0; i < maxResults; i++) {
    const result = results[i];
    
    // Create table row
    if (i % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, y, 15, 8, 'F');
      doc.rect(35, y, 110, 8, 'F');
      doc.rect(145, y, 35, 8, 'F');
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(20, y, 15, 8, 'F');
      doc.rect(35, y, 110, 8, 'F');
      doc.rect(145, y, 35, 8, 'F');
    }
    
    // Add cell content
    doc.text(result.rank.toString(), 22, y + 5.5);
    
    // Truncate long names
    let name = result.name;
    if (name.length > 40) {
      name = name.substring(0, 37) + '...';
    }
    doc.text(name, 37, y + 5.5);
    doc.text(result.score.toFixed(4).toString(), 147, y + 5.5);
    
    y += 8;
  }
  
  // Add outer border to the table
  doc.setDrawColor(51, 102, 204);
  doc.setLineWidth(0.5);
  doc.rect(20, y - maxResults * 8, 160, maxResults * 8);
  
  // Add charts
  if (results.length > 0) {
    // Add new page for charts
    doc.addPage();
    
    // Capture charts as images
    try {
      // Add title to charts page
      doc.setFontSize(14);
      doc.setTextColor(51, 102, 204);
      doc.text('Visualisasi Hasil', 105, 20, { align: 'center' });
      
      // Add bar chart
      const barChart = document.getElementById('barChart');
      if (barChart) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Top 5 Alternatif', 105, 35, { align: 'center' });
        
        html2canvas(barChart).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 20, 40, 170, 80);
          
          // Add radar chart after bar chart is added
          const radarChart = document.getElementById('radarChart');
          if (radarChart) {
            doc.setFontSize(12);
            doc.text('Perbandingan Produk Terbaik vs Ideal', 105, 135, { align: 'center' });
            
            html2canvas(radarChart).then(canvas => {
              const imgData = canvas.toDataURL('image/png');
              doc.addImage(imgData, 'PNG', 35, 140, 140, 80);
              
              // Save PDF after all charts are added
              doc.save(`SPK_${isMousePage ? 'Mouse' : 'Keyboard'}_${today.toISOString().split('T')[0]}.pdf`);
            });
          } else {
            // Save PDF if radar chart is not available
            doc.save(`SPK_${isMousePage ? 'Mouse' : 'Keyboard'}_${today.toISOString().split('T')[0]}.pdf`);
          }
        });
      } else {
        // Save PDF if bar chart is not available
        doc.save(`SPK_${isMousePage ? 'Mouse' : 'Keyboard'}_${today.toISOString().split('T')[0]}.pdf`);
      }
    } catch (e) {
      console.error('Error exporting charts:', e);
      // Save PDF if error occurs with charts
      doc.save(`SPK_${isMousePage ? 'Mouse' : 'Keyboard'}_${today.toISOString().split('T')[0]}.pdf`);
    }
  } else {
    // Save PDF if no results
    doc.save(`SPK_${isMousePage ? 'Mouse' : 'Keyboard'}_${today.toISOString().split('T')[0]}.pdf`);
  }
}