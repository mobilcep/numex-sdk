<div align="center">

<img src="assets/numex-banner.png" alt="Numex" width="100%">

# Numex SDK

**Numex AI API'si ve Numex CLI için resmî Node.js / TypeScript kütüphanesi.**
*Official Node.js / TypeScript library for the Numex AI API and the Numex CLI.*

[![test](https://github.com/numexai/numex-sdk/actions/workflows/test.yml/badge.svg)](https://github.com/numexai/numex-sdk/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/numexcodex-sdk?color=00C9A7)](https://www.npmjs.com/package/numexcodex-sdk)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-339933)](package.json)
[![zero deps](https://img.shields.io/badge/dependencies-0-success)](package.json)

🇹🇷 Türkçe · [🇬🇧 English](#-english)

</div>

---

Numex, *"insanı önce koyan Türk yapay zekâsı"*dır. Bu SDK ile iki şeyi tek satırda yaparsın:

1. **Numex API** — sohbet, akışlı yanıt, görsel üretimi, embedding, arama ve modeller.
2. **CLI Bridge** — Numex CLI'nin otonom kodlama ajanını kendi uygulamandan, CI hattından ya da
   kendi ajanından programatik olarak çalıştır.

Sıfır bağımlılık · CommonJS + ESM · TypeScript tipleri dahil · Node 18+

## 📦 Kurulum

```bash
npm install numexcodex-sdk
```

API anahtarı: [numexai.com.tr](https://numexai.com.tr) → **API** → *Ücretsiz API Anahtarı Al*
(ilk kayıtta 100.000 token hediye). Anahtarlar `nx_live_` ile başlar.

## 🚀 Hızlı başlangıç

```javascript
const { Numex } = require('numexcodex-sdk');        // CommonJS
// import { Numex } from 'numexcodex-sdk';           // ESM / TypeScript

const numex = new Numex({ apiKey: process.env.NUMEX_API_KEY });

const yanit = await numex.chat.completions.create({
  model: 'numex-pro',
  messages: [{ role: 'user', content: 'Merhaba! Kendini bir cümleyle tanıtır mısın?' }],
});
console.log(yanit.answer);   // { success, answer, modelLabel, usage }
```

## 🧠 API

| Kaynak | Metot | Açıklama |
|---|---|---|
| `numex.chat.completions` | `create({ messages \| message+history, model?, stream? })` | Sohbet; `stream: true` ile akışlı. OpenAI tarzı `messages` dizisi otomatik olarak Numex formatına da çevrilir |
| `numex.images` | `generate({ prompt, ... })` | Görsel üretimi |
| `numex.embeddings` | `create({ input })` | Vektör gömme (RAG, anlamsal arama) |
| `numex.search` | `query({ query, num? })` | Web araması + kaynaklar (num: 1–10) |
| `numex.models` | `list()` | Kullanılabilir modeller |

**Modeller:** `numex-pro` (128K, function calling) · `numex-fast` (~3× hızlı) · `numex-think`
(derin akıl yürütme) · `numex-vision` (görsel, OCR) · `numex-code` (64K, 25+ dil).

Varsayılan adres: `https://www.numexai.com.tr/api/v1`. Uç noktaların tam listesi ve yanıt
biçimleri: **[numex-api](https://github.com/numexai/numex-api)**.

```javascript
// Farklı bir uç nokta kullanmak için:
const numex = new Numex({ apiKey: '...', baseURL: 'https://…/v1' });
```

## 💻 CLI Bridge — ajanı kodundan çalıştır

[Numex CLI](https://codex.numexai.com.tr) kuruluysa (`npm i -g @numexai/cli`), otonom ajanı tek satırla
tetikleyebilirsin:

```javascript
const { Numex } = require('numexcodex-sdk');
const numex = new Numex({ command: 'numex' });             // PATH'teki CLI

const r = await numex.run(['plan', 'ödeme modülü ekle'], { timeout: 120000 });
if (r.success) console.log(r.stdout);
else console.error(r.error);
```

`--json` bayrağı olan komutlarda çıktı otomatik ayrıştırılır ve `r.data` içinde döner.

**PATH'ten bağımsız kullanım** — `NumexBridge`, API anahtarı gerektirmez:

```javascript
const path = require('path');
const { NumexBridge } = require('numexcodex-sdk');

const cli = path.resolve('node_modules/@numexai/cli/bin/numex.js');
const bridge = new NumexBridge({ command: process.execPath });
const res = await bridge.run([cli, '--help']);
console.log(res.code, res.stdout);
```

**Nerede işe yarar?**
- CI'da: *"testleri yeşile çek"* görevini ajana ver, sonucu PR'a yaz
- İç araçlarda: dahili panelinden ajana kod incelemesi yaptır
- Kendi ajanında: string ayrıştırmak yerine yapılandırılmış JSON ile Numex'i araç olarak kullan

## 🧪 Test

```bash
npm test
```

CLI kurulu değilse CLI entegrasyon testleri otomatik olarak atlanır.

## 🔐 Güvenlik

- API anahtarını tarayıcı koduna gömme; sunucundan çağır.
- Anahtar yalnızca oluşturulduğunda bir kez gösterilir; panelden döndürebilir (rotate) veya silebilirsin.
- Güvenlik açığı bildirimi: **destek@numexai.com.tr**

## 🌐 Numex Ailesi

Bu SDK, aynı **Core — Beyin** üzerinde çalışan Numex ailesinin geliştirici kapısıdır:
💬 [Numex](https://numexai.com.tr) · 🧩 [Codex](https://codex.numexai.com.tr) ·
🎓 [Okul](https://okul.numexai.com.tr) · 🛍️ [Market](https://market.numexai.com.tr) ·
📦 [Hub](https://hub.numexai.com.tr) · 🏗️ [Forge](https://forge.numexai.com.tr) ·
📖 [Numexpedia](https://pedia.numexai.com.tr)

Ekosistemin tamamı: **[github.com/numexai/numex_nedir](https://github.com/numexai/numex_nedir)**

---

## 🇬🇧 English

Official, zero-dependency Node.js/TypeScript SDK for **Numex AI**, Türkiye's Turkish-first AI.

```bash
npm install numexcodex-sdk
```

```javascript
import { Numex } from 'numexcodex-sdk';
const numex = new Numex({ apiKey: process.env.NUMEX_API_KEY });   // keys start with nx_live_
const res = await numex.chat.completions.create({
  model: 'numex-pro',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

- **API:** `chat.completions.create` (with streaming), `images.generate`, `embeddings.create`,
  `search.query`, `models.list`.
- **Models:** `numex-pro`, `numex-fast`, `numex-think`, `numex-vision`, `numex-code`.
- **CLI Bridge:** run the Numex autonomous coding agent from your own code or CI:
  `await new Numex({ command: 'numex' }).run(['plan', 'add a payment module'])`.
- CommonJS + ESM, TypeScript types included, Node 18+.

Get an API key (100,000 free tokens) at [numexai.com.tr](https://numexai.com.tr).
Full ecosystem overview: [numex_nedir](https://github.com/numexai/numex_nedir/blob/main/README.en.md).

## 📄 Lisans

[MIT](LICENSE) © Numex AI Bilişim Teknolojileri
