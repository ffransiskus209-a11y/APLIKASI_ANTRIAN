import { emptyState, STATUS } from "./queue.js";

export const KUNCI = "queueapp.prototype.v1";

function bentuknyaBenar(data) {
  return (
    data != null &&
    typeof data === "object" &&
    Number.isInteger(data.lastNumber) &&
    Array.isArray(data.queues) &&
    data.queues.every(
      (queue) =>
        Number.isInteger(queue.id) &&
        typeof queue.queueNumber === "string" &&
        Object.hasOwn(STATUS, queue.status),
    )
  );
}

export function muat() {
  try {
    const teks = localStorage.getItem(KUNCI);
    if (!teks) return emptyState();
    const data = JSON.parse(teks);
    if (!bentuknyaBenar(data)) return emptyState();
    return {
      lastNumber: data.lastNumber,
      queues: data.queues,
      myQueueId: Number.isInteger(data.myQueueId) ? data.myQueueId : null,
    };
  } catch {
    return emptyState();
  }
}

export function simpan(state) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(state));
  } catch {
    // Gagal pada mode penyamaran atau penyimpanan penuh
  }
}
