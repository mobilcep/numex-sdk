const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Numex } = require('../src/index');

async function testAgenticE2E() {
  console.log('🧪 Numex SDK → CLI → @numex/core Agentic Zincir Testi...\n');

  const cliPath = path.resolve(__dirname, '../../numex-cli/bin/numex.js');
  const projectRoot = path.resolve(__dirname, '../..');

  if (!fs.existsSync(cliPath)) {
    console.log('⚠️ SKIP: numex CLI bulunamadı (' + cliPath + ')');
    return;
  }

  const numex = new Numex({
    requireApiKey: false,
    command: process.execPath
  });

  // 1) numex.run() ile 'guard' (Commit Risk Taraması - @numex/core/commitGuard.js)
  console.log('1) SDK üzerinden numex.run("guard", ["--json"]) tetikleniyor...');
  const guardRes = await numex.run([cliPath, 'guard', '--json'], { cwd: projectRoot, timeout: 15000 });

  console.log('   Çıkış Kodu:', guardRes.code);
  console.log('   Success:', guardRes.success);
  console.log('   Ayrıştırılan Data:\n', JSON.stringify(guardRes.data, null, 2));

  assert.strictEqual(guardRes.success, true, 'Guard komutu başarılı olmalı');
  assert.ok(guardRes.data && typeof guardRes.data === 'object', 'Guard çıktısı JSON nesnesi olarak parse edilmeli');
  assert.ok('risk' in guardRes.data || 'ok' in guardRes.data, 'Guard verisi risk veya ok alanını içermeli');

  // 2) numex.run() ile 'harita' (Proje Haritası Üretici - @numex/core/projectMapGen.js)
  console.log('\n2) SDK üzerinden numex.run("harita", ["--dry"]) tetikleniyor...');
  const mapRes = await numex.run([cliPath, 'harita', '--dry'], { cwd: projectRoot, timeout: 15000 });

  console.log('   Çıkış Kodu:', mapRes.code);
  console.log('   Success:', mapRes.success);
  console.log('   Stdout İlk 250 Karakter:\n', mapRes.stdout.slice(0, 250));

  assert.strictEqual(mapRes.success, true, 'Harita komutu başarılı olmalı');
  assert.ok(mapRes.stdout.includes('PROJECT_MAP') || mapRes.stdout.includes('dry') || mapRes.stdout.includes('Numex'), 'Harita çıktısı üretilmeli');

  console.log('\n🎉 Zincir Testi Başarılı: SDK (numex.run) → CLI (bin/numex.js) → @numex/core zinciri somut olarak doğrulandı!');
}

testAgenticE2E().catch((err) => {
  console.error('❌ Agentic E2E testi başarısız:', err);
  process.exit(1);
});
