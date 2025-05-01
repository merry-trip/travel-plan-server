// app/tools/archive/test-cmd.mjs

import { execSync } from 'child_process';

try {
  const result = execSync('cmd.exe /c echo Hello from cmd!', { encoding: 'utf-8' });
  console.log('✅ cmd.exe 出力:');
  console.log(result);
} catch (err) {
  console.error('❌ cmd.exe 実行に失敗:');
  console.error(err);
}
