import { currentCalled, waitingQueues, myQueue } from './queue.js';
import { formatJam } from './format.js';

const el = (id) => document.getElementById(id);

function tampilkanYangDipanggil() {
  const dipanggil = currentCalled();
  if (dipanggil) {
    el('nomor-dipanggil').textContent = dipanggil.queueNumber;
    el('keterangan-dipanggil').textContent = `Dipanggil pada pukul ${formatJam(dipanggil.calledAt)}.`;
  } else {
    el('nomor-dipanggil').textContent = '—';
    el('keterangan-dipanggil').textContent = 'Belum ada antrean yang dipanggil.';
  }
}

function tampilkanYangMenunggu() {
  const daftar = waitingQueues();
  const wadah = el('daftar-menunggu');
  wadah.replaceChildren();

  if (daftar.length === 0) {
    el('jumlah-menunggu').textContent = 'Belum ada antrean yang menunggu.';
    return;
  }

  el('jumlah-menunggu').textContent = `${daftar.length} antrean masih menunggu.`;
  for (const antrean of daftar) {
    const item = document.createElement('li');
    item.textContent = antrean.queueNumber;
    wadah.append(item);
  }
}

function tampilkanNomorSaya() {
  const antrean = myQueue();
  if (antrean) {
    el('nomor-saya').textContent = `Nomor Anda ${antrean.queueNumber}, berstatus ${antrean.status}.`;
  }
}

tampilkanYangDipanggil();
tampilkanYangMenunggu();
tampilkanNomorSaya();