// app/scripts/run-batchCompleteFullSpots.mjs

import { batchCompleteFullSpots } from '../domains/spots/batchCompleteFullSpots.mjs';
import config from '@/config.mjs';

if (config.env !== 'test') {
  batchCompleteFullSpots();  // 本番 or dev 環境でのみ実行
}
