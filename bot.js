// ARX SQUAD BOT - VERSI RENDER - AUTO FORWARD
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const qrcode = require('qrcode-terminal');
const app = express();
app.use(express.json());

let sock;
let terakhirKirim = 0;
let COOLDOWN = 5 * 60 * 1000;

async function mulaiBot() {
  const { state, saveCreds } = await useMultiFileAuthState('ARX-SESI');
  sock = makeWASocket({ auth: state, printQRInTerminal: false });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u) => {
    if (u.qr) {
      console.log("SCAN QR INI DI WA KAU:");
      qrcode.generate(u.qr, { small: true });
    }
    if (u.connection === 'open') console.log("BOT ARX UDAH NYAMBUNG!");
    if (u.connection === 'close') mulaiBot();
  });
}

app.post('/spawn', async (req, res) => {
  let pesan = (req.body.content || req.body.pesan || "").toUpperCase();
  let adoEternal = pesan.includes("ETERNAL");
  let adoDivine = pesan.includes("DIVINE");
  if (!adoEternal && !adoDivine) return res.send("Bukan Eternal/Divine, skip");
  if (Date.now() - terakhirKirim < COOLDOWN) return res.send("Masih cooldown 5 menit");
  let tipe = adoDivine ? "DIVINE" : "ETERNAL";
  let teks = `⚡ ${tipe} HAS SPAWNED! ⚡\n\n🐉 Pet: ${req.body.content}\n📍 Area: COSMIC\n🤸🏻 Recommend Speed: 700M\n\n🎮 JOIN GAME:\nhttps://www.roblox.com/games/107778070777162/Steal-an-Egg\n\n⚡ Buruan masuk game & steal sebelum keduluan‼️\n\n⛔ DILARANG MENGAMBIL ATAU MENGCOPY SEMUA YANG ADA DISINI KECUALI SUDAH IZIN‼️\n> ARX SQUAD ⚡`;
  let idSaluran = process.env.CHANNEL_ID || "120207xxx@newsletter";
  await sock.sendMessage(idSaluran, { text: teks });
  terakhirKirim = Date.now();
  res.send("UDAH KIRIM!");
});

app.get('/', (req, res) => res.send("ARX BOT JALAN!"));
app.listen(3000, () => console.log("Server jalan di 3000"));
mulaiBot();
