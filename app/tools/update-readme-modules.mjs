// app/tools/update-readme-modules.mjs

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { logInfo, logError } from '../utils/logger.mjs';

// ✅ __dirname 再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ルートと README パス
const rootDir = path.join(__dirname, '..');
const readmePath = path.join(rootDir, 'README.md');

logInfo('update-readme-modules', '✅ スクリプト実行開始');

let output;
try {
  logInfo('update-readme-modules', '[STEP 1] npm list を取得しています...');

  output = execSync('npm.cmd list --depth=0 --json', {
    cwd: rootDir,
    encoding: 'utf-8'
  });

  logInfo('update-readme-modules', '[STEP 2] npm list の取得に成功しました');

  const json = JSON.parse(output);
  const deps = json.dependencies || {};
  logInfo('update-readme-modules', `[STEP 3] モジュール数: ${Object.keys(deps).length}`);

  const moduleList = Object.entries(deps)
    .map(([name, info]) => `- \`${name}\` : ${info.version}`)
    .join('\n');

  let readme = fs.readFileSync(readmePath, 'utf-8');
  const tag = '## 📦 使用している外部モジュール';
  const newSection = `${tag}\n\n${moduleList}`;

  if (readme.includes(tag)) {
    readme = readme.replace(new RegExp(`${tag}[\\s\\S]*?(?=\n##|$)`), newSection);
    logInfo('update-readme-modules', '[STEP 4] タグを置換しました');
  } else {
    readme += `\n\n${newSection}\n`;
    logInfo('update-readme-modules', '[STEP 4] タグを新規追加しました');
  }

  fs.writeFileSync(readmePath, readme);
  logInfo('update-readme-modules', '[STEP 5] README.md を更新しました ✅');

} catch (err) {
  logError('update-readme-modules', `実行失敗: ${err.message}`);
  logError('update-readme-modules', err.stack);
  process.exit(1);
}
