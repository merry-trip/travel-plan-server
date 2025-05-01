// app/tools/export-knowledge-md.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logError } from '../utils/logger.mjs';

const context = 'export-knowledge-md';

// ✅ __dirname 再現（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📄 入力ファイルと出力先パス
const inputPath = path.resolve(__dirname, '../data/project-knowledge.json');
const outputPath = path.resolve('docs/project-knowledge.md');

try {
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const data = JSON.parse(raw);
  const rows = data.files;

  let md = '# 📘 Project Knowledge 一覧（自動生成）\n\n';
  md += `バージョン: \`${data.version}\` / 最終更新: \`${data.generated_at}\`\n\n`;
  md += '| No | Category | Path | Description |\n';
  md += '|----|----------|------|-------------|\n';

  rows.forEach((file, i) => {
    const num = i + 1;
    const category = file.category || 'unknown';
    const description = file.description?.replace(/\|/g, '｜').replace(/\n/g, ' ') || '(説明なし)';
    md += `| ${num} | ${category} | \`${file.path}\` | ${description} |\n`;
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, md, 'utf-8');

  logInfo(context, `✅ Markdown出力完了: ${outputPath}`);
} catch (err) {
  logError(context, `❌ Markdown出力失敗: ${err.message}`);
}
