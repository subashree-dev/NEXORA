import { RegressionDataPoint, LinearRegressionModel, PredictionResult } from '../types';

/**
 * Demo historical training dataset representing past batch alumni outcomes (Batches 2021-2025).
 * Paired observations:
 * X = Total LeetCode problems solved
 * Y = Faculty-evaluated Placement Readiness Score (0-100)
 *
 * NOTE: Clearly labeled as synthetic demo training data for academic demonstration.
 */
export const DEMO_TRAINING_DATA: RegressionDataPoint[] = [
  { totalSolved: 45, readinessScore: 32, studentRef: 'Batch 2022 - Benchmark 01' },
  { totalSolved: 80, readinessScore: 37, studentRef: 'Batch 2022 - Benchmark 02' },
  { totalSolved: 110, readinessScore: 40, studentRef: 'Batch 2022 - Benchmark 03' },
  { totalSolved: 150, readinessScore: 44, studentRef: 'Batch 2023 - Benchmark 04' },
  { totalSolved: 190, readinessScore: 48, studentRef: 'Batch 2023 - Benchmark 05' },
  { totalSolved: 230, readinessScore: 52, studentRef: 'Batch 2023 - Benchmark 06' },
  { totalSolved: 280, readinessScore: 57, studentRef: 'Batch 2023 - Benchmark 07' },
  { totalSolved: 320, readinessScore: 61, studentRef: 'Batch 2024 - Benchmark 08' },
  { totalSolved: 360, readinessScore: 66, studentRef: 'Batch 2024 - Benchmark 09' },
  { totalSolved: 400, readinessScore: 70, studentRef: 'Batch 2024 - Benchmark 10' },
  { totalSolved: 440, readinessScore: 74, studentRef: 'Batch 2024 - Benchmark 11' },
  { totalSolved: 480, readinessScore: 78, studentRef: 'Batch 2025 - Benchmark 12' },
  { totalSolved: 520, readinessScore: 82, studentRef: 'Batch 2025 - Benchmark 13' },
  { totalSolved: 570, readinessScore: 87, studentRef: 'Batch 2025 - Benchmark 14' },
  { totalSolved: 620, readinessScore: 91, studentRef: 'Batch 2025 - Benchmark 15' },
  { totalSolved: 680, readinessScore: 96, studentRef: 'Batch 2025 - Benchmark 16' },
  { totalSolved: 720, readinessScore: 99, studentRef: 'Batch 2025 - Benchmark 17' },
];

/**
 * Validates a dataset of regression data points.
 */
export function validateTrainingData(data: RegressionDataPoint[]): { isValid: boolean; error?: string } {
  if (!Array.isArray(data) || data.length < 2) {
    return {
      isValid: false,
      error: 'Insufficient training data: At least 2 valid paired observations are required to fit a linear regression line.',
    };
  }

  for (let i = 0; i < data.length; i++) {
    const pt = data[i];
    if (typeof pt.totalSolved !== 'number' || isNaN(pt.totalSolved) || pt.totalSolved < 0) {
      return { isValid: false, error: `Invalid problem count at observation index ${i}.` };
    }
    if (typeof pt.readinessScore !== 'number' || isNaN(pt.readinessScore) || pt.readinessScore < 0 || pt.readinessScore > 100) {
      return { isValid: false, error: `Invalid readiness score at observation index ${i}. Must be between 0 and 100.` };
    }
  }

  // Check variance in X to avoid division by zero
  const xValues = data.map((d) => d.totalSolved);
  const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const xVariance = xValues.reduce((acc, x) => acc + Math.pow(x - xMean, 2), 0);

  if (xVariance === 0) {
    return {
      isValid: false,
      error: 'Zero variance in independent variable (X): All problem counts are identical. Slope cannot be computed.',
    };
  }

  return { isValid: true };
}

/**
 * Fits an Ordinary Least Squares (OLS) Simple Linear Regression model:
 * Y = Intercept + (Slope * X)
 *
 * Slope (m) = sum((X - meanX) * (Y - meanY)) / sum((X - meanX)^2)
 * Intercept (b) = meanY - (Slope * meanX)
 */
export function trainLinearRegression(data: RegressionDataPoint[] = DEMO_TRAINING_DATA): LinearRegressionModel {
  const validation = validateTrainingData(data);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Failed to train regression model');
  }

  const n = data.length;
  const sumX = data.reduce((acc, d) => acc + d.totalSolved, 0);
  const sumY = data.reduce((acc, d) => acc + d.readinessScore, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let denominator = 0;

  for (const d of data) {
    const xDiff = d.totalSolved - meanX;
    const yDiff = d.readinessScore - meanY;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  // Compute R^2 (Coefficient of Determination) and Mean Squared Error (MSE)
  let ssTot = 0;
  let ssRes = 0;

  for (const d of data) {
    const actualY = d.readinessScore;
    const predictedY = intercept + slope * d.totalSolved;
    ssTot += Math.pow(actualY - meanY, 2);
    ssRes += Math.pow(actualY - predictedY, 2);
  }

  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  const meanSquaredError = ssRes / n;

  return {
    slope: Math.round(slope * 10000) / 10000, // 4 decimal places
    intercept: Math.round(intercept * 100) / 100, // 2 decimal places
    rSquared: Math.round(rSquared * 10000) / 10000,
    meanSquaredError: Math.round(meanSquaredError * 100) / 100,
    sampleSize: n,
    trainingData: data,
    datasetDescription: 'Demo Historical Training Dataset (Batch 2021-2025 Benchmarks)',
    isDemoData: true,
  };
}

/**
 * Consistent trained model instance cached for production and development.
 */
let trainedModelInstance: LinearRegressionModel | null = null;

export function getTrainedModel(): LinearRegressionModel {
  if (!trainedModelInstance) {
    trainedModelInstance = trainLinearRegression(DEMO_TRAINING_DATA);
  }
  return trainedModelInstance;
}

/**
 * Predicts placement readiness score using the fitted linear regression model.
 * Result is clamped between 0 and 100.
 */
export function predictReadiness(totalSolved: number, model: LinearRegressionModel = getTrainedModel()): PredictionResult {
  const safeTotal = Math.max(0, typeof totalSolved === 'number' && !isNaN(totalSolved) ? totalSolved : 0);
  const rawScore = model.intercept + model.slope * safeTotal;
  const clamped = Math.max(0, Math.min(100, Math.round(rawScore)));

  const formula = `Readiness = ${model.intercept.toFixed(2)} + (${model.slope.toFixed(4)} × ${safeTotal})`;

  return {
    totalSolved: safeTotal,
    predictedScore: clamped,
    rawScore: Math.round(rawScore * 10) / 10,
    formula,
    explanation: `Based on OLS Simple Linear Regression: Y = ${model.intercept.toFixed(2)} + ${model.slope.toFixed(4)}·X, evaluating X = ${safeTotal} problems yields a predicted readiness score of ${clamped}/100.`,
    isDemoData: model.isDemoData,
  };
}
