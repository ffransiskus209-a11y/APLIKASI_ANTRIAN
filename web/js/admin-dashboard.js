// web/js/admin-dashboard.js

import {
  summary,
  nextInLine,
  allQueues,
  callNext,
  completeQueue,
  STATUS,
} from './queue.js';
import { formatJam, isoUntukAtribut } from './format.js';

const el = (id) => document.getElementById(id);

function tampilkanRingkasan() {
  const ringkasan = summary();
  const dipanggil = allQueues().find((q) => q.status === STATUS.CALLED);

  el('ringkas-dipanggil').textContent = dipanggil ? dipanggil.queueNumber : '-';
  el('ringkas-menunggu').textContent = String(ringkasan.waiting);
  el('ringkas-selesai').textContent = String(ringkasan.completed);
}

function tampilkanAksi() {
  const berikutnya = nextInLine();

  el('berikutnya').textContent = berikutnya
    ? `Antrean berikutnya yang akan dipanggil: ${berikutnya.queueNumber}.`
    : 'Belum ada antrean yang menunggu.';

  // Tombol dipadamkan/dimatikan bila tidak ada antrean yang menunggu
  el('tombol-panggil').disabled = berikutnya === null;
}

function selWaktu(iso) {
  const td = document.createElement('td');
  if (!iso) {
    td.textContent = '-';
    return td;
  }
  const time = document.createElement('time');
  time.dateTime = isoUntukAtribut(iso);
  time.textContent = formatJam(iso);
  td.append(time);
  return td;
}

function selUntuk(teks) {
  const td = document.createElement('td');
  td.textContent = teks;
  return td;
}

function barisUntuk(antrean) {
  const baris = document.createElement('tr');

  // Nomor antrean sebagai th scope="row" untuk aksesibilitas
  const nomor = document.createElement('th');
  nomor.scope = 'row';
  nomor.textContent = antrean.queueNumber;
  baris.append(nomor);

  const status = selUntuk(antrean.status);
  status.dataset.status = antrean.status;
  baris.append(status);

  baris.append(selWaktu(antrean.createdAt));
  baris.append(selWaktu(antrean.calledAt));
  baris.append(selWaktu(antrean.completedAt));

  const aksi = document.createElement('td');
  if (antrean.status === STATUS.CALLED) {
    const tombol = document.createElement('button');
    tombol.type = 'button';
    tombol.textContent = `Selesaikan ${antrean.queueNumber}`;
    tombol.dataset.selesaikan = String(antrean.id);
    aksi.append(tombol);
  } else {
    aksi.textContent = '-';
  }
  baris.append(aksi);

  return baris;
}

function tampilkanTabel() {
  const daftar = allQueues();
  const wadah = el('isi-antrean');
  wadah.replaceChildren();

  if (daftar.length === 0) {
    const baris = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.textContent = 'Belum ada antrean.';
    baris.append(td);
    wadah.append(baris);
    return;
  }

  for (const antrean of daftar) {
    wadah.append(barisUntuk(antrean));
  }
}

function pesan(teks) {
  el('pesan-aksi').textContent = teks;
}

function render() {
  tampilkanRingkasan();
  tampilkanAksi();
  tampilkanTabel();
}

// Event handler untuk panggil antrean berikutnya
el('form-panggil').addEventListener('submit', (event) => {
  event.preventDefault();
  const hasil = callNext();
  pesan(hasil.ok ? '' : hasil.message);
  render();
});

// Delegasi event klik pada tbody untuk tombol selesaikan
el('isi-antrean').addEventListener('click', (event) => {
  const tombol = event.target.closest('[data-selesaikan]');
  if (!tombol) return;

  const hasil = completeQueue(Number(tombol.dataset.selesaikan));
  pesan(hasil.ok ? '' : hasil.message);
  render();
});

// Render awal saat halaman dimuat
render();