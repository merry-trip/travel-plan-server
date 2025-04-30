// app/tools/update-knowledge-json.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(process.cwd(), 'app');
const outputPath = path.resolve(process.cwd(), 'app/data/project-knowledge.json');

const EXTENSION = '.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCategory(filePath) {
  const segments = filePath.split(path.sep);
  return segments.length >= 2 ? segments[1] : 'unknown';
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (file.endsWith(EXTENSION)) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

function generateKnowledge() {
  const filePaths = getAllFiles(rootDir);

  const files = filePaths.map((fullPath) => {
    const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
    return {
      path: relativePath,
      category: getCategory(relativePath),
      description: ""
    };
  });

  const knowledge = {
    version: "v1.7.0",
    generated_at: new Date().toISOString(),
    files
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(knowledge, null, 2), 'utf-8');

  console.log(`✅ project-knowledge.json を更新しました (${files.length}ファイル)`);
}

generateKnowledge();
