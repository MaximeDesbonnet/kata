import { execSync } from 'node:child_process';

/**
 * Golden master: 30 days of the reference inventory, compared to a recorded
 * snapshot. It locks the observable behaviour while the code is refactored.
 */
describe('Gilded Rose Approval', () => {
  it('should thirtyDays', () => {
    const consoleOutput = execSync(
      'tsx test/golden-master-text-test.ts 30',
      { encoding: 'utf-8' }
    );

    expect(consoleOutput).toMatchSnapshot();
  });
});
