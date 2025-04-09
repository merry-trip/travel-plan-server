const { execSync } = require('child_process');

try {
  const output = execSync('npm -v', { encoding: 'utf-8' });
  console.log('✅ npm 実行成功:');
  console.log(output);
} catch (err) {
  console.error('❌ npm 実行失敗:');
  console.error(err);
}
