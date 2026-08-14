import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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



// ======================================================
// SISTEM PENDATAAN PESERTA LOMBA 17 AGUSTUS
// ======================================================

const STORAGE_KEY = "dataPesertaLomba";
const LOMBA_KEY = "daftarLomba";


// ======================================================
// DATA PESERTA
// ======================================================

function getPeserta() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        console.error("Gagal membaca data peserta:", error);
        return [];
    }
}


function savePeserta(data) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


// ======================================================
// DATA LOMBA
// ======================================================

function getLomba() {
    try {
        const data = localStorage.getItem(LOMBA_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {
        console.error("Gagal membaca daftar lomba:", error);
        return [];
    }
}


function saveLomba(data) {
    localStorage.setItem(
        LOMBA_KEY,
        JSON.stringify(data)
    );
}


// ======================================================
// HALAMAN PENDAFTARAN
// ======================================================

const pesertaForm =
    document.getElementById("pesertaForm");


if (pesertaForm) {

    loadLombaSelect();

    const btnLombaBaru =
        document.getElementById("btnLombaBaru");

    const newLombaBox =
        document.getElementById("newLombaBox");

    const namaLombaBaru =
        document.getElementById("namaLombaBaru");

    const pilihLomba =
        document.getElementById("pilihLomba");


    // ==================================================
    // TAMBAH LOMBA
    // ==================================================

    if (btnLombaBaru) {

        btnLombaBaru.addEventListener(
            "click",
            function () {

                const sedangTerbuka =
                    newLombaBox &&
                    newLombaBox.classList.contains("active");


                // ------------------------------------------
                // BUKA FORM LOMBA BARU
                // ------------------------------------------

                if (!sedangTerbuka) {

                    if (newLombaBox) {
                        newLombaBox.classList.add("active");
                    }

                    btnLombaBaru.textContent =
                        "✓ Simpan Lomba";

                    if (namaLombaBaru) {
                        namaLombaBaru.focus();
                    }

                    return;
                }


                // ------------------------------------------
                // SIMPAN LOMBA
                // ------------------------------------------

                const nama =
                    namaLombaBaru.value.trim();


                if (nama === "") {

                    alert(
                        "Masukkan nama lomba terlebih dahulu!"
                    );

                    namaLombaBaru.focus();

                    return;
                }


                const daftarLomba =
                    getLomba();


                // Cek apakah sudah ada
                const sudahAda =
                    daftarLomba.some(
                        function (lomba) {

                            return (
                                String(lomba).toLowerCase() ===
                                nama.toLowerCase()
                            );

                        }
                    );


                if (sudahAda) {

                    alert(
                        "Lomba tersebut sudah ada!"
                    );

                    namaLombaBaru.focus();

                    return;
                }


                // Simpan
                daftarLomba.push(nama);

                saveLomba(daftarLomba);


                // Refresh pilihan lomba
                loadLombaSelect();


                // Pilih lomba yang baru dibuat
                if (pilihLomba) {
                    pilihLomba.value = nama;
                }


                // Reset
                namaLombaBaru.value = "";

                if (newLombaBox) {
                    newLombaBox.classList.remove("active");
                }

                btnLombaBaru.textContent =
                    "＋ Tambah Lomba";


                alert(
                    "✅ Lomba berhasil ditambahkan!"
                );

            }
        );

    }


    // ==================================================
    // SUBMIT PESERTA
    // ==================================================

    pesertaForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const namaPeserta =
                document.getElementById("namaPeserta");

            const umurInput =
                document.getElementById("umur");

            const rtRw =
                document.getElementById("rtRw");

            const kategori =
                document.getElementById("kategori");

            const status =
                document.getElementById("status");


            // ==================================================
            // VALIDASI LOMBA
            // ==================================================

            if (!pilihLomba || pilihLomba.value === "") {

                alert(
                    "Silakan pilih lomba terlebih dahulu!"
                );

                return;
            }


            // ==================================================
            // VALIDASI NAMA
            // ==================================================

            if (
                !namaPeserta ||
                namaPeserta.value.trim() === ""
            ) {

                alert(
                    "Nama peserta wajib diisi!"
                );

                namaPeserta.focus();

                return;
            }


            // ==================================================
            // VALIDASI UMUR
            // ==================================================

            const umur =
                Number(
                    umurInput ? umurInput.value : ""
                );


            if (
                !Number.isInteger(umur) ||
                umur < 1 ||
                umur > 120
            ) {

                alert(
                    "Umur peserta harus diisi antara 1 sampai 120 tahun!"
                );

                if (umurInput) {
                    umurInput.focus();
                }

                return;
            }


            // ==================================================
            // STATUS
            // ==================================================

            const hasilLomba =
                "Belum Ditentukan";


            // ==================================================
            // DATA BARU
            // ==================================================

            const data =
                getPeserta();


            const pesertaBaru = {

                id: Date.now(),

                namaLomba:
                    pilihLomba.value,

                namaPeserta:
                    namaPeserta.value.trim(),

                umur:
                    umur,

                rtRw:
                    rtRw
                        ? rtRw.value.trim()
                        : "",

                kategori:
                    kategori
                        ? kategori.value
                        : "",

                status:
                    hasilLomba,

                tanggal:
                    new Date().toISOString()

            };


            // ==================================================
            // SIMPAN
            // ==================================================

            data.push(
                pesertaBaru
            );

            savePeserta(
                data
            );


            alert(
                "✅ Peserta berhasil didaftarkan!"
            );


            // ==================================================
            // RESET FORM
            // ==================================================

            namaPeserta.value = "";

            if (umurInput) {
                umurInput.value = "";
            }

            if (rtRw) {
                rtRw.value = "";
            }


            if (namaLombaBaru) {
                namaLombaBaru.value = "";
            }


            if (newLombaBox) {
                newLombaBox.classList.remove("active");
            }


            if (btnLombaBaru) {
                btnLombaBaru.textContent =
                    "＋ Tambah Lomba";
            }


            namaPeserta.focus();

        }
    );
}


// ======================================================
// LOAD DROPDOWN LOMBA
// ======================================================

function loadLombaSelect() {

    const select =
        document.getElementById("pilihLomba");


    if (!select) {
        return;
    }


    const daftarLomba =
        getLomba();


    select.innerHTML = "";


    const defaultOption =
        document.createElement("option");


    defaultOption.value = "";


    defaultOption.textContent =
        "-- Pilih Lomba --";


    select.appendChild(
        defaultOption
    );


    daftarLomba.forEach(
        function (lomba) {

            const option =
                document.createElement("option");


            option.value =
                lomba;


            option.textContent =
                lomba;


            select.appendChild(
                option
            );

        }
    );
}


// ======================================================
// DASHBOARD
// ======================================================

const lombaContainer =
    document.getElementById("lombaContainer");


if (lombaContainer) {

    loadDashboard();


    const searchInput =
        document.getElementById("searchInput");

    const filterLomba =
        document.getElementById("filterLomba");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {
                loadDashboard();
            }
        );

    }


    if (filterLomba) {

        filterLomba.addEventListener(
            "change",
            function () {
                loadDashboard();
            }
        );

    }
}


// ======================================================
// LOAD DASHBOARD
// ======================================================

function loadDashboard() {

    const peserta =
        getPeserta();

    const daftarLomba =
        getLomba();


    updateStatistics(
        peserta,
        daftarLomba
    );


    updateDashboardFilter(
        daftarLomba
    );


    const searchInput =
        document.getElementById("searchInput");

    const filterLomba =
        document.getElementById("filterLomba");


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedLomba =
        filterLomba
            ? filterLomba.value
            : "";


    const filteredPeserta =
        peserta.filter(
            function (item) {

                const nama =
                    String(
                        item.namaPeserta || ""
                    ).toLowerCase();


                const cocokNama =
                    nama.includes(search);


                const cocokLomba =
                    selectedLomba === "" ||
                    item.namaLomba ===
                    selectedLomba;


                return (
                    cocokNama &&
                    cocokLomba
                );

            }
        );


    renderLomba(
        filteredPeserta,
        daftarLomba,
        selectedLomba
    );
}


// ======================================================
// STATISTIK
// ======================================================

function updateStatistics(
    peserta,
    daftarLomba
) {

    const totalPeserta =
        document.getElementById(
            "totalPeserta"
        );

    const totalLomba =
        document.getElementById(
            "totalLomba"
        );

    const totalKategori =
        document.getElementById(
            "totalKategori"
        );


    const kategoriSet =
        new Set();


    peserta.forEach(
        function (item) {

            if (item.kategori) {

                kategoriSet.add(
                    item.kategori
                );

            }

        }
    );


    if (totalPeserta) {

        totalPeserta.textContent =
            peserta.length;

    }


    if (totalLomba) {

        totalLomba.textContent =
            daftarLomba.length;

    }


    if (totalKategori) {

        totalKategori.textContent =
            kategoriSet.size;

    }
}


// ======================================================
// FILTER LOMBA
// ======================================================

function updateDashboardFilter(
    daftarLomba
) {

    const filter =
        document.getElementById(
            "filterLomba"
        );


    if (!filter) {
        return;
    }


    const currentValue =
        filter.value;


    filter.innerHTML = "";


    const semua =
        document.createElement("option");


    semua.value = "";


    semua.textContent =
        "Semua Lomba";


    filter.appendChild(
        semua
    );


    daftarLomba.forEach(
        function (lomba) {

            const option =
                document.createElement("option");


            option.value =
                lomba;


            option.textContent =
                lomba;


            filter.appendChild(
                option
            );

        }
    );


    // Pertahankan pilihan sebelumnya
    if (
        daftarLomba.includes(currentValue)
    ) {

        filter.value =
            currentValue;

    } else {

        filter.value = "";

    }
}


// ======================================================
// RENDER DATA LOMBA
// ======================================================

function renderLomba(
    peserta,
    daftarLomba,
    selectedLomba
) {

    const container =
        document.getElementById(
            "lombaContainer"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        peserta.length === 0
    ) {

        if (emptyState) {
            emptyState.style.display =
                "block";
        }

        return;
    }


    if (emptyState) {
        emptyState.style.display =
            "none";
    }


    let lombaYangDitampilkan =
        daftarLomba;


    if (selectedLomba !== "") {

        lombaYangDitampilkan =
            [selectedLomba];

    }


    lombaYangDitampilkan.forEach(
        function (namaLomba) {

            const pesertaLomba =
                peserta.filter(
                    function (item) {

                        return (
                            item.namaLomba ===
                            namaLomba
                        );

                    }
                );


            if (
                pesertaLomba.length === 0
            ) {
                return;
            }


            // ==================================================
            // CARD
            // ==================================================

            const card =
                document.createElement("div");


            card.className =
                "lomba-card";


            // ==================================================
            // HEADER
            // ==================================================

            const header =
                document.createElement("div");


            header.className =
                "lomba-header";


            const title =
                document.createElement("div");


            title.className =
                "lomba-title";


            title.textContent =
                "🏆 " + namaLomba;


            const actions =
                document.createElement("div");


            actions.className =
                "lomba-actions";


            const jumlah =
                document.createElement("div");


            jumlah.className =
                "jumlah";


            jumlah.textContent =
                pesertaLomba.length +
                " Peserta";


            const deleteLomba =
                document.createElement("button");


            deleteLomba.className =
                "delete-lomba";


            deleteLomba.textContent =
                "🗑️";


            deleteLomba.title =
                "Hapus lomba";


            deleteLomba.addEventListener(
                "click",
                function () {

                    hapusLomba(
                        namaLomba
                    );

                }
            );


            actions.appendChild(
    jumlah
);

// Tombol Bracket
const bracketBtn =
    document.createElement("button");

bracketBtn.className =
    "delete-lomba";

bracketBtn.textContent =
    "🏆";

bracketBtn.title =
    "Bracket Turnamen";

bracketBtn.addEventListener(
    "click",
    function () {
        buatBracket(namaLomba);
    }
);

actions.appendChild(
    bracketBtn
);

actions.appendChild(
    deleteLomba
);


            header.appendChild(
                title
            );


            header.appendChild(
                actions
            );


            card.appendChild(
                header
            );


            // ==================================================
            // TABLE
            // ==================================================

            const wrapper =
                document.createElement("div");


            wrapper.className =
                "table-wrapper";


            const table =
                document.createElement("table");


            const thead =
                document.createElement("thead");


            const headerRow =
                document.createElement("tr");


            const headers = [

                "No",

                "Nama Peserta",

                "Umur",

                "RT / RW",

                "Kategori",

                "Hasil",

                "Aksi"

            ];


            headers.forEach(
                function (text) {

                    const th =
                        document.createElement("th");


                    th.textContent =
                        text;


                    headerRow.appendChild(
                        th
                    );

                }
            );


            thead.appendChild(
                headerRow
            );


            table.appendChild(
                thead
            );


            const tbody =
                document.createElement("tbody");


            pesertaLomba.forEach(
                function (
                    item,
                    index
                ) {

                    const row =
                        document.createElement("tr");


                    // ------------------------------------------
                    // NO
                    // ------------------------------------------

                    const nomor =
                        document.createElement("td");


                    nomor.textContent =
                        index + 1;


                    // ------------------------------------------
                    // NAMA
                    // ------------------------------------------

                    const nama =
                        document.createElement("td");


                    const strong =
                        document.createElement("strong");


                    strong.textContent =
                        item.namaPeserta;


                    nama.appendChild(
                        strong
                    );


                    // ------------------------------------------
                    // UMUR
                    // ------------------------------------------

                    const umur =
                        document.createElement("td");


                    umur.textContent =
                        item.umur
                            ? item.umur + " tahun"
                            : "-";


                    // ------------------------------------------
                    // RT/RW
                    // ------------------------------------------

                    const rt =
                        document.createElement("td");


                    rt.textContent =
                        item.rtRw || "-";


                    // ------------------------------------------
                    // KATEGORI
                    // ------------------------------------------

                    const kategori =
                        document.createElement("td");


                    const kategoriBadge =
                        document.createElement("span");


                    kategoriBadge.className =
                        "badge";


                    kategoriBadge.textContent =
                        item.kategori || "-";


                    kategori.appendChild(
                        kategoriBadge
                    );


                    // ------------------------------------------
                    // HASIL
                    // ------------------------------------------

                    const hasil =
                        document.createElement("td");


                    const hasilBadge =
                        document.createElement("span");


                    hasilBadge.className =
                        "badge";


                    hasilBadge.textContent =
                        item.status ||
                        "Belum Ditentukan";


                    hasil.appendChild(
                        hasilBadge
                    );


                    // ------------------------------------------
                    // AKSI
                    // ------------------------------------------

                    const aksi =
                        document.createElement("td");


                    const edit =
                        document.createElement("button");


                    edit.className =
                        "action-btn edit-btn";


                    edit.textContent =
                        "✏️ Edit";


                    edit.addEventListener(
                        "click",
                        function () {

                            editPeserta(
                                item.id
                            );

                        }
                    );


                    const hapus =
                        document.createElement("button");


                    hapus.className =
                        "action-btn delete-btn";


                    hapus.textContent =
                        "🗑️ Hapus";


                    hapus.addEventListener(
                        "click",
                        function () {

                            hapusPeserta(
                                item.id
                            );

                        }
                    );


                    aksi.appendChild(
                        edit
                    );


                    aksi.appendChild(
                        hapus
                    );


                    // ------------------------------------------
                    // MASUKKAN KE BARIS
                    // ------------------------------------------

                    row.appendChild(
                        nomor
                    );


                    row.appendChild(
                        nama
                    );


                    row.appendChild(
                        umur
                    );


                    row.appendChild(
                        rt
                    );


                    row.appendChild(
                        kategori
                    );


                    row.appendChild(
                        hasil
                    );


                    row.appendChild(
                        aksi
                    );


                    tbody.appendChild(
                        row
                    );

                }
            );


            table.appendChild(
                tbody
            );


            wrapper.appendChild(
                table
            );


            card.appendChild(
                wrapper
            );


            container.appendChild(
                card
            );

        }
    );
}


// ======================================================
// EDIT PESERTA
// ======================================================

function editPeserta(id) {

    const data =
        getPeserta();


    const peserta =
        data.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!peserta) {

        alert(
            "Data peserta tidak ditemukan."
        );

        return;
    }


    // ==================================================
    // NAMA
    // ==================================================

    const nama =
        prompt(
            "Nama Peserta:",
            peserta.namaPeserta || ""
        );


    if (nama === null) {
        return;
    }


    if (nama.trim() === "") {

        alert(
            "Nama peserta tidak boleh kosong."
        );

        return;
    }


    // ==================================================
    // UMUR
    // ==================================================

    const umurInput =
        prompt(
            "Umur:",
            peserta.umur || ""
        );


    if (umurInput === null) {
        return;
    }


    const umur =
        Number(umurInput);


    if (
        !Number.isInteger(umur) ||
        umur < 1 ||
        umur > 120
    ) {

        alert(
            "Umur harus diisi antara 1 sampai 120 tahun."
        );

        return;
    }


    // ==================================================
    // RT/RW
    // ==================================================

    const rtRw =
        prompt(
            "RT / RW:",
            peserta.rtRw || ""
        );


    if (rtRw === null) {
        return;
    }


    // ==================================================
    // KATEGORI
    // ==================================================

    const kategori =
        prompt(
            "Kategori:",
            peserta.kategori || ""
        );


    if (kategori === null) {
        return;
    }


    // ==================================================
    // HASIL LOMBA
    // ==================================================

    const statusInput =
        prompt(
            "Hasil Lomba:\n\nMenang\nKalah\nBelum Ditentukan",
            peserta.status ||
                "Belum Ditentukan"
        );


    if (statusInput === null) {
        return;
    }


    const statusValue =
        statusInput.trim();


    if (
        statusValue !== "Menang" &&
        statusValue !== "Kalah" &&
        statusValue !== "Belum Ditentukan"
    ) {

        alert(
            "Hasil harus:\n" +
            "Menang\n" +
            "Kalah\n" +
            "Belum Ditentukan"
        );

        return;
    }


    // ==================================================
    // SIMPAN PERUBAHAN
    // ==================================================

    peserta.namaPeserta =
        nama.trim();


    peserta.umur =
        umur;


    peserta.rtRw =
        rtRw.trim();


    peserta.kategori =
        kategori.trim();


    peserta.status =
        statusValue;


    savePeserta(
        data
    );


    alert(
        "✅ Data peserta berhasil diperbarui!"
    );


    loadDashboard();
}


// ======================================================
// HAPUS PESERTA
// ======================================================

function hapusPeserta(id) {

    const data =
        getPeserta();


    const peserta =
        data.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!peserta) {
        return;
    }


    const yakin =
        confirm(
            "Hapus peserta:\n\n" +
            peserta.namaPeserta +
            "\n\n" +
            "dari lomba " +
            peserta.namaLomba +
            "?"
        );


    if (!yakin) {
        return;
    }


    const dataBaru =
        data.filter(
            function (item) {

                return item.id !== id;

            }
        );


    savePeserta(
        dataBaru
    );


    loadDashboard();
}


// ======================================================
// HAPUS LOMBA
// ======================================================

function hapusLomba(
    namaLomba
) {

    const data =
        getPeserta();


    const jumlahPeserta =
        data.filter(
            function (item) {

                return (
                    item.namaLomba ===
                    namaLomba
                );

            }
        ).length;


    const yakin =
        confirm(
            "Hapus lomba:\n\n" +
            namaLomba +
            "\n\n" +
            jumlahPeserta +
            " peserta yang terdaftar " +
            "di lomba ini juga akan dihapus."
        );


    if (!yakin) {
        return;
    }


    // Hapus peserta dari lomba tersebut
    const pesertaBaru =
        data.filter(
            function (item) {

                return (
                    item.namaLomba !==
                    namaLomba
                );

            }
        );


    savePeserta(
        pesertaBaru
    );


    // Hapus nama lomba
    const daftarLomba =
        getLomba();


    const lombaBaru =
        daftarLomba.filter(
            function (lomba) {

                return (
                    lomba !==
                    namaLomba
                );

            }
        );


    saveLomba(
        lombaBaru
    );


    alert(
        "✅ Lomba berhasil dihapus."
    );


    loadDashboard();
}

// ==========================================
// BRACKET TURNAMEN
// ==========================================

function buatBracket(namaLomba) {

    const peserta = getPeserta()
        .filter(p => p.namaLomba === namaLomba);

    if (peserta.length < 2) {
        alert("Minimal 2 peserta.");
        return;
    }

    let daftar = [...peserta];

    // acak peserta
    daftar.sort(() => Math.random() - 0.5);

    let html = `
<div id="bracketBox" style="
    background:#fff;
    padding:20px;
    margin-top:20px;
    border-radius:15px;
    border:1px solid #ddd;
">

    <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:15px;
    ">
        <h3>🏆 Bagan Turnamen - ${namaLomba}</h3>

        <button
            onclick="tutupBracket()"
            style="
                background:red;
                color:white;
                border:none;
                padding:8px 12px;
                border-radius:8px;
                cursor:pointer;
            "
        >
            ✖ Tutup
        </button>
    </div>
`;

    for (let i = 0; i < daftar.length; i += 2) {

        const a = daftar[i]
            ? daftar[i].namaPeserta
            : "BYE";

        const b = daftar[i + 1]
            ? daftar[i + 1].namaPeserta
            : "BYE";

        html += `
        <div style="
            border:1px solid #eee;
            border-radius:10px;
            padding:15px;
            margin-bottom:12px;
            background:#fafafa;
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:10px;
            ">
                <b>${a}</b>
                <span>VS</span>
                <b>${b}</b>
            </div>

            <button
                onclick="pilihPemenang('${a}','${b}','${namaLomba}', this)"
                style="
                    margin-right:8px;
                    padding:8px 12px;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                "
            >
                ${a} Menang
            </button>

            <button
                onclick="pilihPemenang('${b}','${a}','${namaLomba}', this)"
                style="
                    padding:8px 12px;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                "
            >
                ${b} Menang
            </button>

        </div>
        `;
    }

    html += "</div>";

    const area = document.createElement("div");
area.innerHTML = html;

const lama =
    document.getElementById(
        "bracketBox"
    );

if (lama) {
    lama.remove();
}

document.body.appendChild(area);
}

function pilihPemenang(
    pemenang,
    kalah,
    namaLomba,
    tombol
) {

    const data = getPeserta();

    data.forEach(function(item){

        if(item.namaLomba === namaLomba){

            if(item.namaPeserta === pemenang){
                item.status = "Menang";
            }

            if(item.namaPeserta === kalah){
                item.status = "Kalah";
            }

        }

    });

    savePeserta(data);

    const pertandingan =
        tombol.parentElement;

    const nama =
        pertandingan.querySelectorAll("b");

    nama.forEach(function(el){

        if(el.textContent === pemenang){
            el.style.color = "#16a34a";
            el.style.fontWeight = "bold";
        }

        if(el.textContent === kalah){
            el.style.color = "#dc2626";
            el.style.fontWeight = "bold";
        }

    });

    const semuaTombol =
        pertandingan.querySelectorAll(
            "button"
        );

    semuaTombol.forEach(function(btn){
        btn.disabled = true;
        btn.style.opacity = "0.5";
    });

    loadDashboard();

    alert(
        "🏆 " +
        pemenang +
        " menang melawan " +
        kalah
    );
}

function tutupBracket() {

    const box =
        document.getElementById(
            "bracketBox"
        );

    if (box) {
        box.remove();
    }
}
