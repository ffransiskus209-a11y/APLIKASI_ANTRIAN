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
  async function jalankan(aksi) {
    setSibuk(true);
    setPesan("");
    let hasil = null;
    try {
      hasil = await aksi();
    } catch (galat) {
      setPesan(galat.message);
    }

    /* Daftar diambil ulang apa pun hasil aksinya, supaya layar 
     tidak menampilkan tebakan saat terjadi kegagalan sesaat. */
    try {
      setMuatan({
        status: "siap",
        antrean: await ambilDaftarAntrean(),
        galat: null,
      });
    } catch {
      // Abaikan jika penyegaran gagal, karena aksi utama sudah sukses
    }

    setSibuk(false);
    return hasil;
  }
}
