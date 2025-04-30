// app/tools/update-structure-json.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = process.cwd(); // travel-plan-server/
const outputPath = path.join(rootDir, 'docs/project-structure.json');

// 記録対象拡張子（必要に応じて追加）
const VALID_EXTENSIONS = ['.mjs', '.json', '.txt', '.md'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 無視するフォルダ
const IGNORE_DIRS = ['node_modules', '.git', '.github'];

// ファイル種別を決める
function getFileType(ext) {
  if (ext === '.mjs') return 'code';
  if (ext === '.json') return 'config';
  if (ext === '.md') return 'doc';
  if (ext === '.txt') return 'note';
  return 'other';
}

function getAllFiles(dir, result = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        getAllFiles(fullPath, result);
      }
    } else {
      const ext = path.extname(entry.name);
      if (VALID_EXTENSIONS.includes(ext)) {
        const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
        result.push({
          path: relativePath,
          type: getFileType(ext),
          description: "" // あとで補完 or 自動推定
        });
      }
    }
  }

  return result;
}

function generateProjectStructure() {
  const files = getAllFiles(rootDir);
  const output = {
    generated_at: new Date().toISOString(),
    version: "v1.7.0",
    files
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`✅ project-structure.json を更新しました（${files.length}ファイル）`);
}

generateProjectStructure();
