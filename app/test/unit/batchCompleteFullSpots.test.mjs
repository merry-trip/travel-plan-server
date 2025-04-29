// test/unit/batchCompleteFullSpots.test.mjs

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as logger from '../../../app/utils/logger.mjs';
import { batchCompleteFullSpots } from '../../../app/domains/spots/batchCompleteFullSpots.mjs';

describe('batchCompleteFullSpots', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call logInfo multiple times during batch processing', async () => {
    const spyLog = vi.spyOn(logger, 'logInfo');

    await batchCompleteFullSpots();

    expect(spyLog).toHaveBeenCalled();
    expect(spyLog.mock.calls.length).toBeGreaterThan(1); // 何回か呼ばれていること

    // 特定ログが含まれているか確認（任意）
    const messages = spyLog.mock.calls.map(call => call[1]);
    const foundStartLog = messages.find(msg => msg.includes('補完バッチ開始'));
    expect(foundStartLog).toBeTruthy();
  });
});
