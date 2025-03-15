// -----------------------
// Variabel Global
// -----------------------
let mainContent = document.querySelector('.main-content');
let sidebar = document.getElementById("sidebar");
let openSidebarBtn = document.getElementById("openSidebar");
let closeSidebarBtn = document.getElementById("closeSidebar");

// Dashboard container
let dashboard1 = document.getElementById("dashboard1");
let dashboard2 = document.getElementById("dashboard2");
let dashboard3 = document.getElementById("dashboard3");

// Sub-dashboard di Dashboard 1
let kriteriaBobot = document.getElementById("kriteriaBobot");
let penginputanData = document.getElementById("penginputanData");
let hasilPerhitungan = document.getElementById("hasilPerhitungan");

// Data Alternatif
let dataAlternatif = [];

// Bobot kriteria (sesuai urutan definisi, total 100%)
const bobot = {
  // 1
  harga: 0.15,              // cost
  // 2
  garansi: 0.10,            // benefit
  // 3
  jumlahFan: 0.03,          // benefit
  // 4
  storage: 0.04,            // benefit
  // 5
  tambahan: 0.05,           // benefit
  // 6
  ukuranMonitor: 0.05,      // benefit
  // 7
  resolusiMonitor: 0.05,    // benefit
  // 8
  refreshRate: 0.05,        // benefit
  // 9
  jenisPanel: 0.05,         // benefit
  // 10
  jumlahPortMonitor: 0.05,  // benefit
  // 11
  fiturTambahanMonitor: 0.05,// benefit
  // 12
  jenisProsesor: 0.05,      // benefit
  // 13
  kondisiProsesor: 0.02,    // benefit
  // 14
  jenisGPU: 0.05,           // benefit
  // 15
  kondisiGPU: 0.02,         // benefit
  // 16
  slotRAM: 0.04,            // benefit
  // 17
  kecepatanRAM: 0.04,       // benefit
  // 18
  slotSSD: 0.04,            // benefit
  // 19
  fiturTambahanMobo: 0.04,  // benefit
  // 20
  slotPCIe: 0.04            // benefit
};


// Skor panel (contoh)
const skorPanel = {
  "IPS": 5,
  "PLS": 4.5,
  "AHVA": 4,
  "VA": 3,
  "TN": 2,
  "OLED": 5,
  "MicroLED": 5,
  "Mini LED": 4.5,
  "QD-OLED": 5,
  "AMOLED": 5,
  "LTPO": 4.5,
  "TFT": 2.5,
  "HVA": 3.5,
  "MVA": 3,
  "ADS": 4.5,
  "e-Ink": 3.5
};

// Skor resolusi (contoh; Anda bisa menyesuaikan lagi)
const skorResolusi = {
  "1280x720": 921600,
  "1920x1080": 2073600,
  "2560x1440": 3686400,
  "3840x2160": 8294400,
  "5120x2880": 14745600
};

// Skor prosesor (sangat disederhanakan, isi sesuai tabel di atas)
const skorProsesor = {
  "Core i3-10100": 9000,
  "Core i5-10400": 12000,
  "Core i7-10700K": 17000,
  "Core i9-10900K": 20000,
  "Core i3-11100": 9500,
  "Core i5-11400": 14000,
  "Core i7-11700K": 23000,
  "Core i9-11900K": 28000,
  "Core i3-12100": 10000,
  "Core i5-12600K": 19000,
  "Core i7-12700K": 25000,
  "Core i9-12900K": 30000,
  "Core i3-13100": 11000,
  "Core i5-13600K": 22000,
  "Core i7-13700K": 28000,
  "Core i9-13900K": 35000,

  "Ryzen 3 3100": 8000,
  "Ryzen 5 3600": 14000,
  "Ryzen 7 3700X": 19000,
  "Ryzen 9 3900X": 25000,
  "Ryzen 3 4100": 9000,
  "Ryzen 5 4600G": 15000,
  "Ryzen 7 4700G": 20000,
  "Ryzen 9 4900H": 22000,
  "Ryzen 3 5300G": 10000,
  "Ryzen 5 5600X": 16000,
  "Ryzen 7 5800X": 21000,
  "Ryzen 9 5950X": 35000,
  "Ryzen 3 7320U": 7950,
  "Ryzen 5 7600X": 20000,
  "Ryzen 7 7700X": 25000,
  "Ryzen 9 7900X": 30000
};

// Skor GPU (disederhanakan, gunakan Benchmark Score misalnya)
const skorGPU = {
  "GTX 1660 Super": 5800,
  "RTX 2060": 7800,
  "RTX 2060 Super": 8500,
  "RTX 2070": 9200,
  "RTX 2070 Super": 10000,
  "RTX 2080": 10500,
  "RTX 2080 Super": 11200,
  "RTX 2080 Ti": 13200,
  "RTX 3050": 6500,
  "RTX 3050 Ti": 6800,
  "RTX 3060": 9000,
  "RTX 3060 Ti": 10500,
  "RTX 3070": 12000,
  "RTX 3070 Ti": 12700,
  "RTX 3080": 14800,
  "RTX 3080 Ti": 15500,
  "RTX 3090": 16800,
  "RTX 3090 Ti": 17500,
  "RTX 4060": 9800,
  "RTX 4060 Ti": 11500,
  "RTX 4070": 13500,
  "RTX 4070 Ti": 14500,
  "RTX 4080": 18000,
  "RTX 4090": 22000,
  "RTX 5090": 28000,

  "RX 580": 5500,
  "RX 590": 6200,
  "RX 5600 XT": 8200,
  "RX 5700 XT": 10500,
  "RX 6700 XT": 12000,
  "RX 6800 XT": 15000,
  "RX 6900 XT": 16500,
  "RX 7900 XT": 19500,
  "RX 7900 XTX": 21500,

  "Arc A380": 5000,
  "Arc A750": 9500,
  "Arc A770": 10500
};



// -----------------------
// Fungsi untuk bukatutup Submenu
function toggleSubmenuDashboard1() {
  // Panggil fungsi untuk menampilkan dashboard1 (jika diperlukan)
  showDashboard('dashboard1');

  // Cari submenu dari menu-item ini (pastikan struktur HTML sesuai)
  const submenu = document.querySelector('.menu-item .submenu');
  // Toggle kelas 'active'
  submenu.classList.toggle('active');
}



// -----------------------
// Fungsi Tampilkan Sidebar
// -----------------------
// Tambahkan variabel mainContent


openSidebarBtn.addEventListener("click", function() {
  sidebar.classList.remove("hidden");
  mainContent.classList.remove("full");
});

closeSidebarBtn.addEventListener("click", function() {
  sidebar.classList.add("hidden");
  mainContent.classList.add("full");
});

// -----------------------
// Fungsi Tampilkan Dashboard
// -----------------------
function showDashboard(id) {
  // Sembunyikan semua dashboard
  dashboard1.classList.remove("active");
  dashboard2.classList.remove("active");
  dashboard3.classList.remove("active");

  // Tampilkan dashboard yang dipilih
  document.getElementById(id).classList.add("active");

  // Jika yang dipilih adalah dashboard1, tampilkan sub-dashboard default (kriteriaBobot)
  if (id === "dashboard1") {
    showSubDashboard("kriteriaBobot");
  }
}

// -----------------------
// Fungsi Tampilkan Sub-Dashboard (hanya di Dashboard 1)
// -----------------------
function showSubDashboard(id) {
  kriteriaBobot.classList.remove("active");
  penginputanData.classList.remove("active");
  hasilPerhitungan.classList.remove("active");

  document.getElementById(id).classList.add("active");
}

// -----------------------
// Event onChange Garansi
// -----------------------
let garansiSelect = document.getElementById("garansi");
let garansiBulanGroup = document.getElementById("garansiBulanGroup");

garansiSelect.addEventListener("change", function() {
  if (this.value === "ya") {
    garansiBulanGroup.style.display = "block";
  } else {
    garansiBulanGroup.style.display = "none";
  }
});

// -----------------------
// Fungsi Tambah Alternatif
// -----------------------
function tambahAlternatif() {
  // Ambil nilai form
  let namaAlternatif = document.getElementById("namaAlternatif").value.trim();
  let harga = parseFloat(document.getElementById("harga").value) || 0;
  let garansi = document.getElementById("garansi").value;
  let garansiBulan = parseFloat(document.getElementById("garansiBulan").value) || 0;
  let jumlahFan = parseFloat(document.getElementById("jumlahFan").value) || 0;
  let jenisStorage = document.getElementById("jenisStorage").value;
  let kapasitasStorage = parseFloat(document.getElementById("kapasitasStorage").value) || 0;

  // Tambahan (Mouse, Keyboard, Speaker)
  let hasMouse = document.getElementById("hasMouse").checked;
  let hasKeyboard = document.getElementById("hasKeyboard").checked;
  let hasSpeaker = document.getElementById("hasSpeaker").checked;

  let ukuranMonitor = parseFloat(document.getElementById("ukuranMonitor").value) || 0;
  let resolusiMonitor = document.getElementById("resolusiMonitor").value;
  let refreshRate = parseFloat(document.getElementById("refreshRate").value) || 0;
  let jenisPanel = document.getElementById("jenisPanel").value;
  let jumlahPortMonitor = parseFloat(document.getElementById("jumlahPortMonitor").value) || 0;
  let fiturTambahanMonitor = parseFloat(document.getElementById("fiturTambahanMonitor").value) || 0;

  let jenisProsesor = document.getElementById("jenisProsesor").value;
  let kondisiProsesor = document.getElementById("kondisiProsesor").value;
  let jenisGPU = document.getElementById("jenisGPU").value;
  let kondisiGPU = document.getElementById("kondisiGPU").value;

  let slotRAM = parseFloat(document.getElementById("slotRAM").value) || 0;
  let kecepatanRAM = parseFloat(document.getElementById("kecepatanRAM").value) || 0;
  let slotSSD = parseFloat(document.getElementById("slotSSD").value) || 0;

  // Fitur tambahan Mobo
  let moboWifi = document.getElementById("moboWifi").checked;
  let moboBluetooth = document.getElementById("moboBluetooth").checked;

  let slotPCIe = parseFloat(document.getElementById("slotPCIe").value) || 0;

  // Validasi nama
  if (!namaAlternatif) {
    alert("Nama Alternatif harus diisi.");
    return;
  }

  // Bentuk object data
  let obj = {
    namaAlternatif,
    harga,
    garansi,
    garansiBulan,
    jumlahFan,
    jenisStorage,
    kapasitasStorage,
    hasMouse,
    hasKeyboard,
    hasSpeaker,
    ukuranMonitor,
    resolusiMonitor,
    refreshRate,
    jenisPanel,
    jumlahPortMonitor,
    fiturTambahanMonitor,
    jenisProsesor,
    kondisiProsesor,
    jenisGPU,
    kondisiGPU,
    slotRAM,
    kecepatanRAM,
    slotSSD,
    moboWifi,
    moboBluetooth,
    slotPCIe
  };

  // Masukkan ke array
  dataAlternatif.push(obj);

  // Tampilkan di tabel
  renderTabelAlternatif();

  // Reset form (opsional)
  document.getElementById("formAlternatif").reset();
  garansiBulanGroup.style.display = "none";
}

// -----------------------
// Fungsi Render Tabel Alternatif
// -----------------------
function renderTabelAlternatif() {
  let tbody = document.querySelector("#tabelAlternatif tbody");
  tbody.innerHTML = "";

  dataAlternatif.forEach((item, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.namaAlternatif}</td>
      <td>${item.harga}</td>
      <td>${item.garansi} ${item.garansi === "ya" ? `(${item.garansiBulan} bln)` : ""}</td>
      <td>${item.jumlahFan}</td>
      <td>${item.jenisStorage} ${item.kapasitasStorage}GB</td>
      <td>
        ${item.hasMouse ? "Mouse," : ""}
        ${item.hasKeyboard ? "Keyboard," : ""}
        ${item.hasSpeaker ? "Speaker" : ""}
      </td>
      <td>
        ${item.ukuranMonitor}" | ${item.resolusiMonitor} | ${item.refreshRate}Hz | ${item.jenisPanel} | ${item.jumlahPortMonitor} port | Fitur:${item.fiturTambahanMonitor}
      </td>
      <td>
        ${item.jenisProsesor} (${item.kondisiProsesor})
      </td>
      <td>
        ${item.jenisGPU} (${item.kondisiGPU})
      </td>
      <td>
        Slot RAM:${item.slotRAM} | ${item.kecepatanRAM}MHz | Slot SSD:${item.slotSSD} | 
        ${item.moboWifi ? "WiFi " : ""}${item.moboBluetooth ? "Bluetooth " : ""}|
        Slot PCIe:${item.slotPCIe}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -----------------------
// Fungsi Hitung SAW
// -----------------------
function hitungSAW() {
  if (dataAlternatif.length === 0) {
    alert("Belum ada alternatif yang ditambahkan.");
    return;
  }

  // 1. Buat array untuk menampung nilai setiap kriteria sebelum normalisasi
  let matrix = [];

  // 2. Konversi data ke dalam bentuk numeric (untuk kriteria benefit/cost)
  dataAlternatif.forEach((alt) => {
    // 1) Harga (Cost) -> Semakin kecil semakin baik
    let cHarga = alt.harga;

    // 2) Garansi (Benefit) -> Semakin besar (lama garansi) semakin baik
    // jika "tidak" => 0, jika "ya" => garansiBulan
    let cGaransi = (alt.garansi === "ya") ? alt.garansiBulan : 0;

    // 3) Jumlah Fan (Benefit)
    let cFan = alt.jumlahFan;

    // 4) Storage (Jenis & Kapasitas) (Benefit)
    // misal kita beri penambahan skor 1000 jika SSD, 500 jika HDD, lalu ditambah kapasitas
    let baseStorage = (alt.jenisStorage === "SSD") ? 1000 : 500;
    let cStorage = baseStorage + alt.kapasitasStorage;

    // 5) Tambahan (Mouse, Keyboard, Speaker) (Benefit)
    // Apabila tidak ada => 0, ada 1 => 1, ada 2 => 2, ada 3 => 3
    let cTambahan = 0;
    if (alt.hasMouse) cTambahan++;
    if (alt.hasKeyboard) cTambahan++;
    if (alt.hasSpeaker) cTambahan++;

    // 6) Ukuran Layar Monitor (Benefit)
    let cUkuranMonitor = alt.ukuranMonitor;

    // 7) Resolusi Layar (Benefit) -> gunakan skorResolusi
    let cResolusiMonitor = skorResolusi[alt.resolusiMonitor] || 0;

    // 8) Refresh Rate (Benefit)
    let cRefreshRate = alt.refreshRate;

    // 9) Jenis Panel (Benefit) -> gunakan skorPanel
    let cJenisPanel = skorPanel[alt.jenisPanel] || 0;

    // 10) Jumlah Port Monitor (Benefit)
    let cJumlahPortMonitor = alt.jumlahPortMonitor;

    // 11) Fitur Tambahan Monitor (Benefit)
    let cFiturTambahanMonitor = alt.fiturTambahanMonitor;

    // 12) Jenis Prosesor (Benefit) -> skorProsesor
    let cJenisProsesor = skorProsesor[alt.jenisProsesor] || 0;

    // 13) Kondisi Prosesor (Benefit)
    // Baru => 2, Bekas => 1 (misal)
    let cKondisiProsesor = (alt.kondisiProsesor === "baru") ? 2 : 1;

    // 14) Jenis GPU (Benefit) -> skorGPU
    let cJenisGPU = skorGPU[alt.jenisGPU] || 0;

    // 15) Kondisi GPU (Benefit)
    // Baru => 2, Bekas => 1
    let cKondisiGPU = (alt.kondisiGPU === "baru") ? 2 : 1;

    // 16) Slot RAM (Benefit)
    let cSlotRAM = alt.slotRAM;

    // 17) Kecepatan RAM (MHz) (Benefit)
    let cKecepatanRAM = alt.kecepatanRAM;

    // 18) Slot SSD (Benefit)
    let cSlotSSD = alt.slotSSD;

    // 19) Fitur Tambahan Mobo (Benefit)
    // jika wifi & bluetooth => 2, jika salah satu => 1, jika tidak ada => 0
    let cFiturTambahanMobo = 0;
    if (alt.moboWifi) cFiturTambahanMobo++;
    if (alt.moboBluetooth) cFiturTambahanMobo++;

    // 20) Slot PCIe (Benefit)
    let cSlotPCIe = alt.slotPCIe;

    matrix.push({
      alt: alt.namaAlternatif,
      // masukkan nilai
      harga: cHarga,
      garansi: cGaransi,
      fan: cFan,
      storage: cStorage,
      tambahan: cTambahan,
      ukuranMonitor: cUkuranMonitor,
      resolusiMonitor: cResolusiMonitor,
      refreshRate: cRefreshRate,
      jenisPanel: cJenisPanel,
      jumlahPortMonitor: cJumlahPortMonitor,
      fiturTambahanMonitor: cFiturTambahanMonitor,
      jenisProsesor: cJenisProsesor,
      kondisiProsesor: cKondisiProsesor,
      jenisGPU: cJenisGPU,
      kondisiGPU: cKondisiGPU,
      slotRAM: cSlotRAM,
      kecepatanRAM: cKecepatanRAM,
      slotSSD: cSlotSSD,
      fiturTambahanMobo: cFiturTambahanMobo,
      slotPCIe: cSlotPCIe
    });
  });

  // 3. Cari max/min untuk setiap kriteria
  // cost -> min, benefit -> max
  let minHarga = Math.min(...matrix.map(m => m.harga));
  let maxGaransi = Math.max(...matrix.map(m => m.garansi));
  let maxFan = Math.max(...matrix.map(m => m.fan));
  let maxStorage = Math.max(...matrix.map(m => m.storage));
  let maxTambahan = Math.max(...matrix.map(m => m.tambahan));
  let maxUkuranMonitor = Math.max(...matrix.map(m => m.ukuranMonitor));
  let maxResolusiMonitor = Math.max(...matrix.map(m => m.resolusiMonitor));
  let maxRefreshRate = Math.max(...matrix.map(m => m.refreshRate));
  let maxJenisPanel = Math.max(...matrix.map(m => m.jenisPanel));
  let maxJumlahPortMonitor = Math.max(...matrix.map(m => m.jumlahPortMonitor));
  let maxFiturTambahanMonitor = Math.max(...matrix.map(m => m.fiturTambahanMonitor));
  let maxJenisProsesor = Math.max(...matrix.map(m => m.jenisProsesor));
  let maxKondisiProsesor = Math.max(...matrix.map(m => m.kondisiProsesor));
  let maxJenisGPU = Math.max(...matrix.map(m => m.jenisGPU));
  let maxKondisiGPU = Math.max(...matrix.map(m => m.kondisiGPU));
  let maxSlotRAM = Math.max(...matrix.map(m => m.slotRAM));
  let maxKecepatanRAM = Math.max(...matrix.map(m => m.kecepatanRAM));
  let maxSlotSSD = Math.max(...matrix.map(m => m.slotSSD));
  let maxFiturTambahanMobo = Math.max(...matrix.map(m => m.fiturTambahanMobo));
  let maxSlotPCIe = Math.max(...matrix.map(m => m.slotPCIe));

  // 4. Normalisasi
  let normalisasi = matrix.map(m => {
    // cost -> min / x
    let nHarga = (m.harga === 0) ? 0 : (minHarga / m.harga);

    // benefit -> x / max
    let nGaransi = (maxGaransi === 0) ? 0 : (m.garansi / maxGaransi);
    let nFan = (maxFan === 0) ? 0 : (m.fan / maxFan);
    let nStorage = (maxStorage === 0) ? 0 : (m.storage / maxStorage);
    let nTambahan = (maxTambahan === 0) ? 0 : (m.tambahan / maxTambahan);
    let nUkuranMonitor = (maxUkuranMonitor === 0) ? 0 : (m.ukuranMonitor / maxUkuranMonitor);
    let nResolusiMonitor = (maxResolusiMonitor === 0) ? 0 : (m.resolusiMonitor / maxResolusiMonitor);
    let nRefreshRate = (maxRefreshRate === 0) ? 0 : (m.refreshRate / maxRefreshRate);
    let nJenisPanel = (maxJenisPanel === 0) ? 0 : (m.jenisPanel / maxJenisPanel);
    let nJumlahPortMonitor = (maxJumlahPortMonitor === 0) ? 0 : (m.jumlahPortMonitor / maxJumlahPortMonitor);
    let nFiturTambahanMonitor = (maxFiturTambahanMonitor === 0) ? 0 : (m.fiturTambahanMonitor / maxFiturTambahanMonitor);
    let nJenisProsesor = (maxJenisProsesor === 0) ? 0 : (m.jenisProsesor / maxJenisProsesor);
    let nKondisiProsesor = (maxKondisiProsesor === 0) ? 0 : (m.kondisiProsesor / maxKondisiProsesor);
    let nJenisGPU = (maxJenisGPU === 0) ? 0 : (m.jenisGPU / maxJenisGPU);
    let nKondisiGPU = (maxKondisiGPU === 0) ? 0 : (m.kondisiGPU / maxKondisiGPU);
    let nSlotRAM = (maxSlotRAM === 0) ? 0 : (m.slotRAM / maxSlotRAM);
    let nKecepatanRAM = (maxKecepatanRAM === 0) ? 0 : (m.kecepatanRAM / maxKecepatanRAM);
    let nSlotSSD = (maxSlotSSD === 0) ? 0 : (m.slotSSD / maxSlotSSD);
    let nFiturTambahanMobo = (maxFiturTambahanMobo === 0) ? 0 : (m.fiturTambahanMobo / maxFiturTambahanMobo);
    let nSlotPCIe = (maxSlotPCIe === 0) ? 0 : (m.slotPCIe / maxSlotPCIe);

    return {
      alt: m.alt,
      nHarga,
      nGaransi,
      nFan,
      nStorage,
      nTambahan,
      nUkuranMonitor,
      nResolusiMonitor,
      nRefreshRate,
      nJenisPanel,
      nJumlahPortMonitor,
      nFiturTambahanMonitor,
      nJenisProsesor,
      nKondisiProsesor,
      nJenisGPU,
      nKondisiGPU,
      nSlotRAM,
      nKecepatanRAM,
      nSlotSSD,
      nFiturTambahanMobo,
      nSlotPCIe
    };
  });

  // 5. Hitung skor akhir (dengan bobot)
  let hasil = normalisasi.map(n => {
    let skor =
      (n.nHarga * bobot.harga) +
      (n.nGaransi * bobot.garansi) +
      (n.nFan * bobot.jumlahFan) +
      (n.nStorage * bobot.storage) +
      (n.nTambahan * bobot.tambahan) +
      (n.nUkuranMonitor * bobot.ukuranMonitor) +
      (n.nResolusiMonitor * bobot.resolusiMonitor) +
      (n.nRefreshRate * bobot.refreshRate) +
      (n.nJenisPanel * bobot.jenisPanel) +
      (n.nJumlahPortMonitor * bobot.jumlahPortMonitor) +
      (n.nFiturTambahanMonitor * bobot.fiturTambahanMonitor) +
      (n.nJenisProsesor * bobot.jenisProsesor) +
      (n.nKondisiProsesor * bobot.kondisiProsesor) +
      (n.nJenisGPU * bobot.jenisGPU) +
      (n.nKondisiGPU * bobot.kondisiGPU) +
      (n.nSlotRAM * bobot.slotRAM) +
      (n.nKecepatanRAM * bobot.kecepatanRAM) +
      (n.nSlotSSD * bobot.slotSSD) +
      (n.nFiturTambahanMobo * bobot.fiturTambahanMobo) +
      (n.nSlotPCIe * bobot.slotPCIe);

    return {
      alt: n.alt,
      skor
    };
  });

  // Urutkan hasil
  hasil.sort((a, b) => b.skor - a.skor);

  // Tampilkan di sub-dashboard hasilPerhitungan
  showSubDashboard("hasilPerhitungan");
  renderHasilSAW(normalisasi, hasil);
}

// -----------------------
// Fungsi Render Hasil SAW
// -----------------------
function renderHasilSAW(normalisasi, hasil) {
  let container = document.getElementById("hasilPerhitunganContainer");
  container.innerHTML = "";

  // Tabel normalisasi
  let tableNorm = document.createElement("table");
  tableNorm.className = "table-normalisasi";
  let theadNorm = document.createElement("thead");
  theadNorm.innerHTML = `
    <tr>
      <th>Alternatif</th>
      <th>Harga (Cost)</th>
      <th>Garansi</th>
      <th>Fan</th>
      <th>Storage</th>
      <th>Tambahan</th>
      <th>Ukr Monitor</th>
      <th>Res Monitor</th>
      <th>RR</th>
      <th>Panel</th>
      <th>Port</th>
      <th>Fitur M</th>
      <th>Proc</th>
      <th>Kond.Proc</th>
      <th>GPU</th>
      <th>Kond.GPU</th>
      <th>SlotRAM</th>
      <th>RAM MHz</th>
      <th>SlotSSD</th>
      <th>Fitur Mobo</th>
      <th>SlotPCIe</th>
    </tr>
  `;
  let tbodyNorm = document.createElement("tbody");

  normalisasi.forEach(n => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${n.alt}</td>
      <td>${n.nHarga.toFixed(4)}</td>
      <td>${n.nGaransi.toFixed(4)}</td>
      <td>${n.nFan.toFixed(4)}</td>
      <td>${n.nStorage.toFixed(4)}</td>
      <td>${n.nTambahan.toFixed(4)}</td>
      <td>${n.nUkuranMonitor.toFixed(4)}</td>
      <td>${n.nResolusiMonitor.toFixed(4)}</td>
      <td>${n.nRefreshRate.toFixed(4)}</td>
      <td>${n.nJenisPanel.toFixed(4)}</td>
      <td>${n.nJumlahPortMonitor.toFixed(4)}</td>
      <td>${n.nFiturTambahanMonitor.toFixed(4)}</td>
      <td>${n.nJenisProsesor.toFixed(4)}</td>
      <td>${n.nKondisiProsesor.toFixed(4)}</td>
      <td>${n.nJenisGPU.toFixed(4)}</td>
      <td>${n.nKondisiGPU.toFixed(4)}</td>
      <td>${n.nSlotRAM.toFixed(4)}</td>
      <td>${n.nKecepatanRAM.toFixed(4)}</td>
      <td>${n.nSlotSSD.toFixed(4)}</td>
      <td>${n.nFiturTambahanMobo.toFixed(4)}</td>
      <td>${n.nSlotPCIe.toFixed(4)}</td>
    `;
    tbodyNorm.appendChild(tr);
  });

  tableNorm.appendChild(theadNorm);
  tableNorm.appendChild(tbodyNorm);
  container.appendChild(tableNorm);

  // Tabel skor akhir
  let tableHasil = document.createElement("table");
  tableHasil.className = "table-hasil";
  let theadHasil = document.createElement("thead");
  theadHasil.innerHTML = `
    <tr>
      <th>Peringkat</th>
      <th>Alternatif</th>
      <th>Skor Akhir</th>
    </tr>
  `;
  let tbodyHasil = document.createElement("tbody");

  hasil.forEach((h, i) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${h.alt}</td>
      <td>${h.skor.toFixed(4)}</td>
    `;
    tbodyHasil.appendChild(tr);
  });

  tableHasil.appendChild(theadHasil);
  tableHasil.appendChild(tbodyHasil);
  container.appendChild(tableHasil);

  // Buat chart (opsional, memerlukan Chart.js atau library lain).
  // Contoh singkat (harus load Chart.js di head jika ingin pakai):
  let ctx = document.getElementById("chartHasil").getContext("2d");
  // Hapus chart lama jika ada
  if (window.hasOwnProperty("chartInstance")) {
    window.chartInstance.destroy();
  }

  let labels = hasil.map(h => h.alt);
  let scores = hasil.map(h => h.skor);
  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Skor SAW',
        data: scores,
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
