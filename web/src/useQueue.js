import { useState, useEffect } from "react";
import { muat, simpan } from "./storage.js";
import { takeQueue, callNext, completeQueue } from "./queue.js";

export function useQueue() {
  /* Data antrean dan pesan galat disimpan sebagai SATU state, karena
     keduanya selalu berubah bersamaan. muat dioper sebagai fungsi supaya
     LocalStorage hanya dibaca sekali. */
  const [app, setApp] = useState(() => ({ data: muat(), pesan: "" }));

  useEffect(() => {
    simpan(app.data);
  }, [app.data]);

  /* Yang dioper ke setApp adalah FUNGSI yang menerima state sebelumnya,
     bukan nilai jadi. Menghitung dari variabel hasil render membuat dua
     aksi beruntun berangkat dari state lama yang sama, dan yang belakangan
     menimpa yang duluan[cite: 17]. */
  function jalankan(aksi) {
    setApp((sebelum) => {
      const hasil = aksi(sebelum.data);
      if (!hasil.ok) return { data: sebelum.data, pesan: hasil.message };
      return { data: hasil.state, pesan: "" };
    });
  }

  return {
    state: app.data,
    pesan: app.pesan,
    ambilNomor: () => jalankan((data) => takeQueue(data)),
    panggilBerikutnya: () => jalankan((data) => callNext(data)),
    selesaikan: (id) => jalankan((data) => completeQueue(data, id)),
  };
}
