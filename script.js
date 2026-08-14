
// FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDxdZn5Gq9qGl-Ds5UoU79e71O9CUhDxLE",
    authDomain: "list-lomba.firebaseapp.com",
    databaseURL: "https://list-lomba-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "list-lomba",
    storageBucket: "list-lomba.firebasestorage.app",
    messagingSenderId: "448630145151",
    appId: "1:448630145151:web:c94c35b50414d378be7f4a",
    measurementId: "G-TDZBM327P7"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =======================
// HALAMAN INDEX
// =======================

const btnTambah =
document.getElementById("btnLombaBaru");

const box =
document.getElementById("newLombaBox");

const btnSimpan =
document.getElementById("simpanLomba");

btnTambah.addEventListener("click", () => {
    box.style.display = "block";
});

btnSimpan.addEventListener("click", async () => {

    const nama =
    document
    .getElementById("namaLombaBaru")
    .value
    .trim();

    if (!nama) {
        alert("Isi nama lomba");
        return;
    }

    await push(
        ref(db, "lomba"),
        { nama }
    );

    document
    .getElementById("namaLombaBaru")
    .value = "";

    box.style.display = "none";

    loadLomba();

    alert("Lomba berhasil ditambahkan");
});

async function loadLomba() {
  const select = document.getElementById("pilihLomba");

  if (!select) return;

  select.innerHTML =
    `<option value="">-- Pilih Lomba --</option>`;

  const snapshot = await get(ref(db, "lomba"));

  if (!snapshot.exists()) return;

  snapshot.forEach((item) => {
    const data = item.val();

    select.innerHTML += `
      <option value="${data.nama}">
        ${data.nama}
      </option>
    `;
  });
}

async function simpanPeserta(e) {
  e.preventDefault();

  const peserta = {
    namaLomba:
      document.getElementById("pilihLomba").value,

    namaPeserta:
      document.getElementById("namaPeserta").value,

    umur:
      document.getElementById("umur").value,

    rtRw:
      document.getElementById("rtRw").value,

    kategori:
      document.getElementById("kategori").value,

    status:
      "Belum Ditentukan",

    tanggal:
      new Date().toISOString()
  };

  await push(
    ref(db, "peserta"),
    peserta
  );

  alert("Peserta berhasil didaftarkan");

  document
    .getElementById("pesertaForm")
    .reset();
}

// =======================
// DASHBOARD
// =======================

const lombaContainer =
  document.getElementById("lombaContainer");

if (lombaContainer) {
  loadDashboard();
}

async function loadDashboard() {
  const pesertaSnap =
    await get(ref(db, "peserta"));

  const lombaSnap =
    await get(ref(db, "lomba"));

  const peserta = [];
  const lomba = [];

  if (pesertaSnap.exists()) {
    pesertaSnap.forEach((item) => {
      peserta.push({
        key: item.key,
        ...item.val()
      });
    });
  }

  if (lombaSnap.exists()) {
    lombaSnap.forEach((item) => {
      lomba.push(item.val().nama);
    });
  }

  document.getElementById(
    "totalPeserta"
  ).textContent = peserta.length;

  document.getElementById(
    "totalLomba"
  ).textContent = lomba.length;

  document.getElementById(
    "totalKategori"
  ).textContent =
    new Set(
      peserta.map((p) => p.kategori)
    ).size;

  renderLomba(peserta, lomba);
}

function renderLomba(
  peserta,
  daftarLomba
) {
  const container =
    document.getElementById(
      "lombaContainer"
    );

  container.innerHTML = "";

  daftarLomba.forEach(
    (namaLomba) => {

      const pesertaLomba =
        peserta.filter(
          p =>
            p.namaLomba ===
            namaLomba
        );

      if (
        pesertaLomba.length === 0
      )
        return;

      let html = `
      <div class="lomba-card">
      <div class="lomba-header">
      <div class="lomba-title">
      🏆 ${namaLomba}
      </div>
      <div class="jumlah">
      ${pesertaLomba.length} Peserta
      </div>
      </div>

      <div class="table-wrapper">
      <table>
      <thead>
      <tr>
      <th>No</th>
      <th>Nama</th>
      <th>Umur</th>
      <th>Kategori</th>
      <th>Hasil</th>
      <th>Aksi</th>
      </tr>
      </thead>
      <tbody>
      `;

      pesertaLomba.forEach(
        (p, i) => {
          html += `
          <tr>
          <td>${i + 1}</td>
          <td>${p.namaPeserta}</td>
          <td>${p.umur}</td>
          <td>${p.kategori}</td>
          <td>${p.status}</td>
          <td>
          <button
          onclick="hapusPeserta('${p.key}')">
          Hapus
          </button>
          </td>
          </tr>
          `;
        }
      );

      html += `
      </tbody>
      </table>
      </div>
      </div>
      `;

      container.innerHTML += html;
    }
  );
}

window.hapusPeserta =
async function (id) {

  if (
    !confirm(
      "Hapus peserta?"
    )
  )
    return;

  await remove(
    ref(db, "peserta/" + id)
  );

  loadDashboard();
};
