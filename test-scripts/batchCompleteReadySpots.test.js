// test-scripts/batchCompleteReadySpots.test.js

const { runBatchComplete } = require('../app/scripts/batchCompleteReadySpots');

describe('バッチ処理テスト（status=ready）', () => {
  it('バッチが例外なく完了し、結果がオブジェクトで返ること', async () => {
    const result = await runBatchComplete();

    // 結果がオブジェクトであり、必要なプロパティを持つこと
    expect(result).toHaveProperty('successCount');
    expect(result).toHaveProperty('failCount');
    expect(result).toHaveProperty('failedKeywords');

    // 各プロパティの型検証（数値・配列）
    expect(typeof result.successCount).toBe('number');
    expect(typeof result.failCount).toBe('number');
    expect(Array.isArray(result.failedKeywords)).toBe(true);
  });
});
