import { formatPercentage, convertRatioToPercentage } from './percentage';

describe('formatting', () => {
  it('converts ratio to percentage', () => {
    const percentage = convertRatioToPercentage(0.8);
    expect(percentage).toBe(80);
  });

  it('formats a percentage', () => {
    const formattedPercentage = formatPercentage(80);
    expect(formattedPercentage).toBe('80%');
  });
});
