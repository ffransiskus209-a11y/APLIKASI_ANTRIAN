# QueueApp

## Masalah

QueueApp dibuat untuk membantu pengelolaan antrean secara digital.

## Solusi

Aplikasi antrean sederhana berbasis web.

## Arsitektur

QueueApp menggunakan client web, server/API, dan database MySQL.

## Stack

- Docker
- MySQL
- Node.js
- Nginx
- Git
- GitHub

## Menjalankan Proyek

Salin `.env.example` menjadi `.env`, kemudian jalankan:

```bash
docker compose up -d

## Weekly Progress
- **Minggu 01–06**: Inisialisasi, dasar antrean, Docker Compose, dan migrasi ke React + Vite.
- **Minggu 07**: Integrasi *Client-Side Routing* dan pemisahan lapisan data (*mock API*).
- **Minggu 08**: **Checkpoint UTS / Web MVP**. Perbaikan bug FR-06 (satu aksi mengubah tepat satu antrean), penyempurnaan penanganan *try* pada `useQueue.js`, serta kelengkapan skenario demo 16 langkah tanpa backend.