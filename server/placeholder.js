/*
 * QueueApp — placeholder service (Minggu 01)
 *
 * Ini BUKAN aplikasi backend.
 * Fungsinya hanya membuktikan bahwa container server hidup.
 */

const http = require('node:http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8'
  });

  res.end(
    JSON.stringify(
      {
        service: 'queueapp-server',
        status: 'ok',
        week: 1,
        message: 'Placeholder. Backend sesungguhnya dibangun pada Minggu 09.',
        environment: process.env.NODE_ENV || 'unknown'
      },
      null,
      2
    )
  );
});

server.listen(PORT, () => {
  console.log(`[queueapp] placeholder server berjalan di port ${PORT}`);
});