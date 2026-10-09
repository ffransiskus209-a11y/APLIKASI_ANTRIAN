// web/js/admin-login.js

const el = (id) => document.getElementById(id);

const form = el('form-masuk');
const email = el('email');
const password = el('password');
const pesan = el('pesan-login');

const ATURAN = [
  {
    kolom: () => email,
    salah: (nilai) => nilai.trim() === '',
    pesan: 'Email wajib diisi.',
  },
  {
    kolom: () => email,
    salah: (nilai, kolom) => nilai.trim() !== '' && kolom.validity.typeMismatch,
    pesan: 'Format email tidak valid. Contoh: petugas@queueapp.test',
  },
  {
    kolom: () => password,
    salah: (nilai) => nilai === '',
    pesan: 'Password wajib diisi.',
  },
];

function bersihkanTanda() {
  pesan.textContent = '';
  email.removeAttribute('aria-invalid');
  password.removeAttribute('aria-invalid');
}

function periksa() {
  for (const aturan of ATURAN) {
    const kolom = aturan.kolom();
    if (aturan.salah(kolom.value, kolom)) {
      return { kolom, pesan: aturan.pesan };
    }
  }
  return null;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  bersihkanTanda();

  const galat = periksa();
  if (galat) {
    galat.kolom.setAttribute('aria-invalid', 'true');
    pesan.textContent = galat.pesan;
    galat.kolom.focus();
    return;
  }

  window.location.assign(form.getAttribute('action'));
});