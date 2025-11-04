// ============================================================
// SCRIPT.JS FINAL PROJECT - TOKO BUKU ONLINE
// ============================================================

// ================== LOGIN PAGE ==================
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const pengguna = dataPengguna.find(
    (user) => user.email === email && user.password === password
  );

  if (pengguna) {
    // simpan data pengguna ke localStorage
    localStorage.setItem("userLogin", JSON.stringify(pengguna));
    alert(`Selamat datang, ${pengguna.nama}!`);
    window.location.href = "dashboard.html";
  } else {
    alert("Email atau password salah!");
  }
});

// ========== MODAL LOGIN ==========
const forgotModal = document.getElementById("forgotModal");
const registerModal = document.getElementById("registerModal");
const forgotBtn = document.getElementById("forgotBtn");
const registerBtn = document.getElementById("registerBtn");
const closeForgot = document.getElementById("closeForgot");
const closeRegister = document.getElementById("closeRegister");

forgotBtn?.addEventListener("click", () => (forgotModal.style.display = "block"));
registerBtn?.addEventListener("click", () => (registerModal.style.display = "block"));
closeForgot?.addEventListener("click", () => (forgotModal.style.display = "none"));
closeRegister?.addEventListener("click", () => (registerModal.style.display = "none"));

window.addEventListener("click", (event) => {
  if (event.target == forgotModal) forgotModal.style.display = "none";
  if (event.target == registerModal) registerModal.style.display = "none";
});

// ================== DASHBOARD ==================
function showGreeting() {
  const user = JSON.parse(localStorage.getItem("userLogin"));
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) greeting = "Selamat pagi ☀️";
  else if (hour < 18) greeting = "Selamat siang 🌤️";
  else greeting = "Selamat sore 🌙";

  const greetingEl = document.getElementById("greeting");
  if (greetingEl && user) {
    greetingEl.textContent = `${greeting}, ${user.nama}`;
  } else if (greetingEl) {
    greetingEl.textContent = greeting;
  }
}

function navigateTo(page) {
  window.location.href = page;
}

// tombol logout
document.addEventListener("DOMContentLoaded", () => {
  showGreeting();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userLogin");
      alert("Anda telah logout.");
      window.location.href = "login.html";
    });
  }
});


document.addEventListener("DOMContentLoaded", showGreeting);

// ========== STOK / KATALOG ==========
function tampilkanDataBuku() {
  const tabelBody = document.querySelector("#tabelBuku tbody");
  if (!tabelBody || !Array.isArray(dataKatalogBuku)) return;

  tabelBody.innerHTML = "";
  dataKatalogBuku.forEach((buku, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${buku.cover}" alt="${buku.namaBarang}" style="width:80px; height:100px; object-fit:cover; border-radius:8px;"></td>
      <td>${buku.kodeBarang}</td>
      <td>${buku.namaBarang}</td>
      <td>${buku.jenisBarang}</td>
      <td>${buku.edisi}</td>
      <td>${buku.stok}</td>
      <td>${buku.harga}</td>
    `;
    tabelBody.appendChild(row);
  });
}


function tambahDataBuku() {
  const kodeBarang = prompt("Masukkan kode buku:");
  const namaBarang = prompt("Masukkan nama buku:");
  const jenisBarang = prompt("Masukkan jenis buku:");
  const edisi = prompt("Masukkan edisi:");
  const stok = parseInt(prompt("Masukkan stok:"));
  const harga = prompt("Masukkan harga (contoh: Rp 180.000):");

  if (kodeBarang && namaBarang && jenisBarang && edisi && !isNaN(stok) && harga) {
    dataKatalogBuku.push({
      kodeBarang,
      namaBarang,
      jenisBarang,
      edisi,
      stok,
      harga,
      cover: ""
    });
    tampilkanDataBuku();
    alert("Buku baru berhasil ditambahkan!");
  } else {
    alert("Data tidak valid!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tabelBuku")) {
    tampilkanDataBuku();
    const btnTambah = document.getElementById("tambahBuku");
    if (btnTambah) btnTambah.addEventListener("click", tambahDataBuku);
    showGreeting();
  }
});

// ==== CHECKOUT / PEMESANAN ====
let daftarPesanan = [];

// isi dropdown daftar buku dari dataKatalogBuku
function isiPilihanBuku() {
  const select = document.getElementById("pilihBuku");
  if (!select || !Array.isArray(dataKatalogBuku)) return;

  dataKatalogBuku.forEach((buku) => {
    const option = document.createElement("option");
    option.value = buku.namaBarang;
    option.textContent = `${buku.namaBarang} - ${buku.harga}`;
    option.dataset.harga = buku.harga;
    select.appendChild(option);
  });
}

// tambah pesanan ke tabel
function tambahPesanan() {
  const select = document.getElementById("pilihBuku");
  const jumlah = parseInt(document.getElementById("jumlahBuku").value);

  if (!select.value || isNaN(jumlah) || jumlah <= 0) {
    alert("Pilih buku dan masukkan jumlah yang valid!");
    return;
  }

  const namaBuku = select.value;
  const harga = select.selectedOptions[0].dataset.harga;
  const hargaAngka = parseInt(harga.replace(/\D/g, ""));
  const total = "Rp " + (hargaAngka * jumlah).toLocaleString();

  daftarPesanan.push({ namaBuku, jumlah, harga, total });
  tampilkanPesanan();
}

function tampilkanPesanan() {
  const tabelBody = document.querySelector("#tabelPesanan tbody");
  if (!tabelBody) return;

  tabelBody.innerHTML = "";
  daftarPesanan.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.namaBuku}</td>
      <td>${p.jumlah}</td>
      <td>${p.harga}</td>
      <td>${p.total}</td>
    `;
    tabelBody.appendChild(row);
  });
}

function kirimPesanan(event) {
  event.preventDefault();
  const nama = document.getElementById("namaPemesan").value;
  const email = document.getElementById("emailPemesan").value;
  const alamat = document.getElementById("alamatPemesan").value;
  const metode = document.getElementById("metodePembayaran").value;

  if (!nama || !email || !alamat || !metode) {
    alert("Semua data wajib diisi!");
    return;
  }

  if (daftarPesanan.length === 0) {
    alert("Tambahkan pesanan terlebih dahulu!");
    return;
  }

  alert(`Terima kasih ${nama}, pesanan Anda telah dikirim!`);
  daftarPesanan = [];
  tampilkanPesanan();
  document.getElementById("formPemesanan").reset();
  isiPilihanBuku();
}

// aktifkan fungsi setelah halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("formPemesanan")) {
    isiPilihanBuku();
    document.getElementById("tambahPesanan").addEventListener("click", tambahPesanan);
    document.getElementById("formPemesanan").addEventListener("submit", kirimPesanan);
  }
});


// ========== TRACKING PENGIRIMAN ==========
function cariTracking() {
  const input = document.getElementById("inputDO").value.trim();
  const hasilDiv = document.getElementById("hasilTracking");

  if (!input) {
    alert("Masukkan nomor Delivery Order terlebih dahulu!");
    return;
  }

  const data = dataTracking[input];
  if (!data) {
    alert("Nomor DO tidak ditemukan!");
    hasilDiv.style.display = "none";
    return;
  }

  document.getElementById("namaPemesan").textContent = data.nama;
  document.getElementById("statusDO").textContent = data.status;
  document.getElementById("ekspedisi").textContent = data.ekspedisi;
  document.getElementById("tanggalKirim").textContent = data.tanggalKirim;
  document.getElementById("jenisPaket").textContent = data.paket;
  document.getElementById("totalBayar").textContent = data.total;

  const statusList = document.getElementById("statusText");
  statusList.innerHTML = "";
  data.perjalanan.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.waktu}</strong><br>${item.keterangan}`;
    statusList.appendChild(li);
  });

  hasilDiv.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("btnCari")) {
    document.getElementById("btnCari").addEventListener("click", cariTracking);
    showGreeting();
  }
});
