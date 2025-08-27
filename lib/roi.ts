export type RoiInputs = {
  monthlyLeads: number;
  averageOrderValue: number; // in currency units
  baselineConversionRate: number; // 0..1 for current response time
  fastResponseConversionRate: number; // 0..1 for ~60s response time
};

export type RoiResult = {
  baselineOrders: number;
  fastResponseOrders: number;
  incrementalOrders: number;
  incrementalRevenue: number;
};

export function calculateRoi(inputs: RoiInputs): RoiResult {
  const { monthlyLeads, averageOrderValue, baselineConversionRate, fastResponseConversionRate } = inputs;

  const safeLeads = Math.max(0, monthlyLeads);
  const safeAov = Math.max(0, averageOrderValue);
  const safeBaseline = clamp(baselineConversionRate, 0, 1);
  const safeFast = clamp(fastResponseConversionRate, 0, 1);

  const baselineOrders = safeLeads * safeBaseline;
  const fastResponseOrders = safeLeads * safeFast;
  const incrementalOrders = Math.max(0, fastResponseOrders - baselineOrders);
  const incrementalRevenue = incrementalOrders * safeAov;

  return { baselineOrders, fastResponseOrders, incrementalOrders, incrementalRevenue };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}


