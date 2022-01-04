import QueryOptions from '../types/QueryOptions';

export interface ShiftToleranceError {
  [atomType: string]: string;
}

export interface ValidationErrors {
  dereplicationOptions?: {
    shiftTolerance?: string;
    maxAverageDeviation?: string;
    checkMultiplicity?: string;
    checkEquivalencesCount?: string;
    useMF?: string;
  };
  elucidationOptions?: {
    allowHeteroHeteroBonds?: string;
    useElim?: string;
    elimP1?: string;
    elimP2?: string;
    useFilterLsdRing3?: string;
    useFilterLsdRing4?: string;
    timeLimitTotal?: string;
    maxAverageDeviation?: string;
  };
  detectionOptions?: {
    useHybridizationDetections?: string;
    useNeighborDetections?: string;
    hybridizationDetectionThreshold?: string;
    lowerElementCountThreshold?: string;
    upperElementCountThreshold?: string;
  };
  retrievalOptions?: { resultID?: string };
}

function isInRange(
  value: string | number,
  min: number | undefined,
  max: number | undefined,
) {
  return (
    typeof value === 'number' &&
    (min === undefined || value >= min) &&
    (max === undefined || value <= max)
  );
}

function validateQueryOptions(values: QueryOptions) {
  const errors: ValidationErrors = {};

  if (!isInRange(values.dereplicationOptions.shiftTolerance, 0, undefined)) {
    if (!errors.dereplicationOptions) {
      errors.dereplicationOptions = {};
    }
    errors.dereplicationOptions.shiftTolerance = 'Must be at least 0';
  }
  if (
    !isInRange(values.dereplicationOptions.maxAverageDeviation, 0, undefined)
  ) {
    if (!errors.dereplicationOptions) {
      errors.dereplicationOptions = {};
    }
    errors.dereplicationOptions.maxAverageDeviation = 'Must be at least 0';
  }

  if (!isInRange(values.elucidationOptions.elimP1, 1, undefined)) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.elimP1 = 'Must be at least 1';
  }
  if (
    !isInRange(values.elucidationOptions.elimP2, 0, 0) &&
    !isInRange(values.elucidationOptions.elimP2, 4, undefined)
  ) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.elimP2 = 'Must be 0 (unlimited) or at least 4';
  }
  if (!isInRange(values.elucidationOptions.timeLimitTotal, 1, undefined)) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.timeLimitTotal = 'Must be at least 1';
  }
  if (!isInRange(values.elucidationOptions.maxAverageDeviation, 1, undefined)) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.maxAverageDeviation = 'Must be at least 0';
  }

  if (
    !isInRange(values.detectionOptions.hybridizationDetectionThreshold, 0, 1)
  ) {
    if (!errors.detectionOptions) {
      errors.detectionOptions = {};
    }
    errors.detectionOptions.hybridizationDetectionThreshold =
      'Must not be less than 0 and not more than 100';
  }
  if (!isInRange(values.detectionOptions.lowerElementCountThreshold, 0, 1)) {
    if (!errors.detectionOptions) {
      errors.detectionOptions = {};
    }
    errors.detectionOptions.lowerElementCountThreshold =
      'Must not be less than 0 and not more than 100';
  }
  if (!isInRange(values.detectionOptions.upperElementCountThreshold, 0, 1)) {
    if (!errors.detectionOptions) {
      errors.detectionOptions = {};
    }
    errors.detectionOptions.upperElementCountThreshold =
      'Must not be less than 0 and not more than 100';
  }

  // console.log(values);
  // console.log(errors);

  return errors;
}

export default validateQueryOptions;
