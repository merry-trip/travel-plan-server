// app/tools/export-structure-md.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logError } from '../utils/logger.mjs';

const context = 'export-structure-md';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const structurePath = path.resolve(__dirname, '../../docs/project-structure.json');
const outputPath = path.resolve(__dirname, '../../docs/project-structure.md');

try {
  const raw = fs.readFileSync(structurePath, 'utf-8');
  const data = JSON.parse(raw);
  const files = data.files || [];

  const tree = {};

  for (const f of files) {
    const parts = f.path.split('/');
    const fileName = parts.pop();
    const dirPath = parts.join('/');
    if (!tree[dirPath]) tree[dirPath] = [];
    tree[dirPath].push({ ...f, fileName });
  }

  const lines = [];
  lines.push(`# 🗂️ Project Structure（自動生成）`);
  lines.push(`\nバージョン: \`${data.version}\` / 最終更新: \`${data.generated_at}\`\n`);

  const sortedDirs = Object.keys(tree).sort();
  for (const dir of sortedDirs) {
    lines.push(`\n## 📁 ${dir}`);
    const files = tree[dir].sort((a, b) => a.fileName.localeCompare(b.fileName));
    for (const f of files) {
      const desc = f.description ? f.description : '(説明なし)';
      lines.push(`- \`${f.fileName}\` (${f.type}) … ${desc}`);
    }
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  logInfo(context, `✅ Markdown構造図を書き出しました: ${outputPath}`);
} catch (err) {
  logError(context, `❌ Markdown構造図の生成に失敗: ${err.message}`);
}
