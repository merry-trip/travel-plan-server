// app/tools/test-function-calling.mjs

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';
import fetch from 'node-fetch'; // ← 追加（v3対応であればこのままでOK）
import config from '../../config.mjs';

// __dirnameを再現（ESM対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI 初期化
const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

// Function定義を読み込み
const functionsPath = path.join(__dirname, '../data/functions.json');
const functions = JSON.parse(fs.readFileSync(functionsPath, 'utf-8'));

// プロンプト入力
const userPrompt = 'loggerに関するファイルを教えて';

// ChatGPTへ問い合わせ
const chatResponse = await openai.chat.completions.create({
  model: 'gpt-4-1106-preview',
  messages: [{ role: 'user', content: userPrompt }],
  functions,
  function_call: 'auto'
});

const choice = chatResponse.choices[0];

console.log('🧠 GPTからのレスポンス:');
console.dir(choice, { depth: null });

// 🧩 関数呼び出しがある場合は、実際にAPIを叩く
if (choice.finish_reason === 'function_call') {
  const func = choice.message.function_call;

  if (func.name === 'search_project_knowledge') {
    const { query } = JSON.parse(func.arguments);

    const url = `http://localhost:3000/api/project-status?query=${encodeURIComponent(query)}`;
    console.log(`📡 APIを呼び出します: ${url}`);

    try {
      const res = await fetch(url);
      const result = await res.json();
      console.log('📦 APIの返却内容:');
      console.dir(result, { depth: null });
      if (result && Array.isArray(result.matched)) {
        console.log(`\n🔍 "${query}" に該当するファイル（${result.matched.length}件）\n`);
        result.matched.forEach((file, i) => {
          const num = i + 1;
          const category = file.category || 'unknown';
          const description = file.description?.trim() || '(説明なし)';
          console.log(`${num}. [${category}] ${file.path}`);
          console.log(`   └─ ${description}\n`);
        });
      }
    } catch (err) {
      console.error('❌ API呼び出し失敗:', err);
    }
  }
}
