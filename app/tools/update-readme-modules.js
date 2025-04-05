const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

logger.logInfo('update-readme-modules', '✅ スクリプト実行開始');

const rootDir = path.join(__dirname, '..'); // ← app フォルダ
const readmePath = path.join(rootDir, 'README.md'); // ← README.md の場所を統一

let output;
try {
  logger.logInfo('update-readme-modules', '[STEP 1] npm list を取得しています...');

  output = execSync('npm.cmd list --depth=0 --json', {
    cwd: rootDir,
    encoding: 'utf-8'
  });

  logger.logInfo('update-readme-modules', '[STEP 2] npm list の取得に成功しました');

  const json = JSON.parse(output);
  const deps = json.dependencies;
  logger.logInfo('update-readme-modules', `[STEP 3] モジュール数: ${Object.keys(deps).length}`);

  const moduleList = Object.entries(deps)
    .map(([name, info]) => `- \`${name}\` : ${info.version}`)
    .join('\n');

  let readme = fs.readFileSync(readmePath, 'utf-8');
  const tag = '## 📦 使用している外部モジュール';
  const newSection = `${tag}\n\n${moduleList}`;

  if (readme.includes(tag)) {
    readme = readme.replace(new RegExp(`${tag}[\\s\\S]*?(?=\n##|$)`), newSection);
    logger.logInfo('update-readme-modules', '[STEP 4] タグを置換しました');
  } else {
    readme += `\n\n${newSection}\n`;
    logger.logInfo('update-readme-modules', '[STEP 4] タグを新規追加しました');
  }

  fs.writeFileSync(readmePath, readme);
  logger.logInfo('update-readme-modules', '[STEP 5] README.md を更新しました ✅');

} catch (err) {
  logger.logError('update-readme-modules', `実行失敗: ${err.message}`);
  logger.logError('update-readme-modules', err.stack);
  process.exit(1);
}
