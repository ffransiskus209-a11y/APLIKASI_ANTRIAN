export const STATUS = Object.freeze({
  WAITING: 'WAITING',
  CALLED: 'CALLED',
  COMPLETED: 'COMPLETED',
});

const TRANSISI_SAH = Object.freeze({
  [STATUS.WAITING]: [STATUS.CALLED],
  [STATUS.CALLED]: [STATUS.COMPLETED],
  [STATUS.COMPLETED]: [],
});

const AWALAN = 'A';
const PANJANG_DIGIT = 3;

export function formatQueueNumber(angka) {
  return AWALAN + String(angka).padStart(PANJANG_DIGIT, '0');
}

function stateKosong() {
  return {
    lastNumber: 0,
    queues: [],
    myQueueId: null,
  };
}

let state = stateKosong();

const KUNCI = 'queueapp.prototype.v1';

function simpan() {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(state));
  } catch {
    // Mode penyamaran atau penyimpanan penuh
  }
}

function bentuknyaBenar(data) {
  return (
    data != null &&
    typeof data === 'object' &&
    Number.isInteger(data.lastNumber) &&
    Array.isArray(data.queues) &&
    data.queues.every(
      (queue) =>
        Number.isInteger(queue.id) &&
        typeof queue.queueNumber === 'string' &&
        Object.hasOwn(STATUS, queue.status)
    )
  );
}

function muat() {
  try {
    const teks = localStorage.getItem(KUNCI);
    if (!teks) return;
    const data = JSON.parse(teks);
    if (!bentuknyaBenar(data)) return;
    state = {
      lastNumber: data.lastNumber,
      queues: data.queues,
      myQueueId: Number.isInteger(data.myQueueId) ? data.myQueueId : null,
    };
  } catch {
    // JSON rusak
  }
}

muat();

export function allQueues() {
  return state.queues.map((queue) => ({ ...queue }));
}

export function findQueue(id) {
  const found = state.queues.find((queue) => queue.id === id);
  return found ? { ...found } : null;
}

export function currentCalled() {
  const found = state.queues.find((queue) => queue.status === STATUS.CALLED);
  return found ? { ...found } : null;
}

export function nextInLine() {
  const found = state.queues.find((queue) => queue.status === STATUS.WAITING);
  return found ? { ...found } : null;
}

export function waitingQueues() {
  return state.queues
    .filter((queue) => queue.status === STATUS.WAITING)
    .map((queue) => ({ ...queue }));
}

export function myQueue() {
  return state.myQueueId === null ? null : findQueue(state.myQueueId);
}

export function summary() {
  const hitung = (status) => state.queues.filter((queue) => queue.status === status).length;
  return {
    waiting: hitung(STATUS.WAITING),
    called: hitung(STATUS.CALLED),
    completed: hitung(STATUS.COMPLETED),
    total: state.queues.length,
  };
}

function boleh(dari, ke) {
  return TRANSISI_SAH[dari].includes(ke);
}

export function takeQueue() {
  state.lastNumber += 1;
  const queue = {
    id: state.lastNumber,
    queueNumber: formatQueueNumber(state.lastNumber),
    status: STATUS.WAITING,
    createdAt: new Date().toISOString(),
    calledAt: null,
    completedAt: null,
  };
  state.queues.push(queue);
  state.myQueueId = queue.id;
  simpan();
  return { ok: true, queue: { ...queue } };
}

export function callNext() {
  const target = state.queues.find((queue) => queue.status === STATUS.WAITING);
  if (!target) {
    return {
      ok: false,
      code: 'NO_WAITING_QUEUE',
      message: 'Tidak ada antrean yang menunggu.',
    };
  }

  const sedangDipanggil = state.queues.find((queue) => queue.status === STATUS.CALLED);
  if (sedangDipanggil) {
    sedangDipanggil.status = STATUS.COMPLETED;
    sedangDipanggil.completedAt = new Date().toISOString();
  }

  target.status = STATUS.CALLED;
  target.calledAt = new Date().toISOString();
  simpan();
  return { ok: true, queue: { ...target } };
}

export function completeQueue(id) {
  const target = state.queues.find((queue) => queue.id === id);
  if (!target) {
    return { ok: false, code: 'QUEUE_NOT_FOUND', message: 'Antrean tidak ditemukan.' };
  }
  if (!boleh(target.status, STATUS.COMPLETED)) {
    return {
      ok: false,
      code: 'INVALID_TRANSITION',
      message: `Antrean berstatus ${target.status} tidak dapat diselesaikan.`,
    };
  }

  target.status = STATUS.COMPLETED;
  target.completedAt = new Date().toISOString();
  simpan();
  return { ok: true, queue: { ...target } };
}