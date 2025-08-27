import { describe, it, expect } from 'vitest';
import { calculateRoi } from '../lib/roi';

describe('calculateRoi', () => {
  it('computes incremental orders and revenue', () => {
    const res = calculateRoi({
      monthlyLeads: 1000,
      averageOrderValue: 60,
      baselineConversionRate: 0.05,
      fastResponseConversionRate: 0.3,
    });

    expect(res.baselineOrders).toBe(50);
    expect(res.fastResponseOrders).toBe(300);
    expect(res.incrementalOrders).toBe(250);
    expect(res.incrementalRevenue).toBe(15000);
  });

  it('clamps values and avoids negatives', () => {
    const res = calculateRoi({
      monthlyLeads: -10,
      averageOrderValue: -5,
      baselineConversionRate: -1,
      fastResponseConversionRate: 2,
    });

    expect(res.baselineOrders).toBe(0);
    expect(res.fastResponseOrders).toBe(0);
    expect(res.incrementalOrders).toBe(0);
    expect(res.incrementalRevenue).toBe(0);
  });
});


