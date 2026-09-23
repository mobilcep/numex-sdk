const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { NumexBridge } = require('../src/index');

async function testCliIntegration() {
  console.log('🧪 Gerçek Numex CLI Entegrasyon Testi Başlatılıyor...\n');

  // CLI yolunu belirle: c:/numexai/numexai/numex-cli/bin/numex.js
  const cliPath = path.resolve(__dirname, '../../numex-cli/bin/numex.js');
  
  if (!fs.existsSync(cliPath)) {
    console.log('⚠️ SKIP: numex CLI bulunamadı (' + cliPath + ')');
    return;
  }

  console.log('🔍 Bulunan CLI Giriş Noktası:', cliPath);

  // Node.js ile bin/numex.js çalıştırmak için command = process.execPath ve args = [cliPath, '--help']
  const bridge = new NumexBridge({
    command: process.execPath
  });

  const res = await bridge.run([cliPath, '--help'], { timeout: 15000 });

  if (!res.success && res.error && (res.error.includes('ENOENT') || res.error.includes('tanınmıyor'))) {
    console.log('⚠️ SKIP: numex CLI bulunamadı veya çalıştırılamadı.');
    return;
  }

  assert.strictEqual(res.success, true, `CLI çağrısı başarılı olmalı (Hata: ${res.error})`);
  assert.ok(
    res.stdout.includes('Kullanım:') || res.stdout.includes('numex') || res.stdout.includes('Numex'),
    'stdout içerisinde yardım veya Numex metni geçmeli'
  );

  console.log('✅ Gerçek Numex CLI entegrasyon testi başarıyla geçti!');
}

testCliIntegration().catch((err) => {
  console.error('❌ CLI Entegrasyon testi başarısız:', err);
  process.exit(1);
});
