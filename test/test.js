const assert = require('assert');
const { Numex, NumexBridge } = require('../src/index');

async function runTests() {
  console.log('🧪 Numex SDK & CLI Bridge Testleri Başlatılıyor...\n');

  // Test 1: Numex Initialization & Sub-modules
  const numex = new Numex({ apiKey: 'test_key_123' });
  
  assert.ok(numex.chat, 'Chat modülü mevcut olmalı');
  assert.ok(numex.images, 'Images modülü mevcut olmalı');
  assert.ok(numex.embeddings, 'Embeddings modülü mevcut olmalı');
  assert.ok(numex.models, 'Models modülü mevcut olmalı');
  assert.ok(numex.search, 'Search modülü mevcut olmalı');
  assert.ok(numex.cli, 'CLI bridge nesnesi mevcut olmalı');
  assert.strictEqual(typeof numex.run, 'function', 'numex.run metodu fonksiyon olmalı');

  console.log('✅ Test 1: Numex SDK başarıyla başlatıldı ve modüller doğrulandı.');

  // Test 2: Numex.run metodu ve komut yapılandırma testi
  assert.strictEqual(typeof numex.run, 'function', 'numex.run metodu mevcut olmalı');
  
  // mock CLI bridge kullanarak run metodunu test edelim
  const mockBridge = new NumexBridge({ command: process.execPath });
  const nodeVersionResult = await mockBridge.run(['-v']);
  assert.strictEqual(nodeVersionResult.success, true, 'Node -v komutu başarılı olmalı');
  assert.ok(nodeVersionResult.stdout.includes('v'), 'stdout Node sürümünü içermeli');

  console.log('✅ Test 2: numex.run metodu ve NumexBridge programatik çalıştırma doğrulandı.');

  // Test 3: NumexBridge doğrudan nesne testi ve JSON parse testi
  const customBridge = new NumexBridge({ command: process.execPath });
  const jsonTestResult = await customBridge.run([
    '-e',
    'console.log("some log"); console.log(JSON.stringify({ status: "ok", count: 42 }));'
  ]);

  assert.strictEqual(jsonTestResult.success, true, 'Custom bridge çalıştırma başarılı olmalı');
  assert.deepStrictEqual(jsonTestResult.data, { status: 'ok', count: 42 }, 'Son JSON çıktısı başarıyla parse edilmeli');

  console.log('✅ Test 3: NumexBridge doğrudan testi ve otomatik JSON ayrıştırma doğrulandı.');

  // Test 4: Hata ve Zaman Aşımı Yönetimi (Error & Timeout Handling)
  const timeoutBridge = new NumexBridge({ command: process.execPath });
  const timeoutResult = await timeoutBridge.run(
    ['-e', 'setTimeout(() => {}, 10000);'],
    { timeout: 300 }
  );

  assert.strictEqual(timeoutResult.success, false, 'Zaman aşımı sonrası success: false dönmeli');
  assert.ok(timeoutResult.error.includes('zaman aşımı'), 'Hata mesajı zaman aşımını belirtmeli');

  console.log('✅ Test 4: Güvenli hata ve zaman aşımı (timeout) yönetimi doğrulandı.');

  console.log('\n🎉 TÜM TESTLER BAŞARIYLA TAMAMLANDI!');
}

runTests().catch((err) => {
  console.error('❌ Test başarısız:', err);
  process.exit(1);
});
