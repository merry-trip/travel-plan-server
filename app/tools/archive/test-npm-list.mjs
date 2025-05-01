// app/tools/archive/test-npm-list.mjs

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ __dirname 再現（ESM用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const output = execSync('npm.cmd list --depth=0 --json', {
    cwd: __dirname,
    encoding: 'utf-8'
  });
  console.log('✅ npm list 出力:');
  console.log(output);
} catch (err) {
  console.error('❌ 実行エラー:', err.message);
}
