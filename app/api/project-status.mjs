// app/api/project-status.mjs
import fs from 'fs';
import path from 'path';
import { logInfo, logError } from '../utils/logger.mjs';

const knowledgePath = path.resolve('app/data/project-knowledge.json');

// GETリクエストを処理
export async function handler(req, res) {
  const { method, url } = req;
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const query = parsedUrl.searchParams.get('query')?.toLowerCase();

  if (method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  if (!query) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Missing query parameter' }));
  }

  let knowledge;
  try {
    const raw = fs.readFileSync(knowledgePath, 'utf-8');
    knowledge = JSON.parse(raw);
  } catch (err) {
    logError('project-status', `Failed to read knowledge JSON: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Failed to read knowledge base' }));
  }

  const matched = knowledge.files.filter((file) =>
    file.path.toLowerCase().includes(query) ||
    file.category?.toLowerCase() === query ||
    file.description?.toLowerCase().includes(query)
  );

  logInfo('project-status', `query=${query} → ${matched.length}件ヒット`);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ query, matched }));
}
