export const DEFAULT_FARE_SETTINGS = {
  baseFare: 35,
  farePerKm: 6.5,
  minimumFare: 45,
  idleFee: 2.5,
  peakHours: 3,
  cancellationFee: 10,
  minimumCancellationFee: 25,
};

const hasWindow = typeof window !== 'undefined';
const storage = hasWindow ? window.localStorage : null;

const cloneDefaultFare = () => ({ ...DEFAULT_FARE_SETTINGS });

export const buildInitialFareState = () => ({
  defaultFare: cloneDefaultFare(),
  categoryFares: {},
  lastUpdated: new Date().toISOString(),
});

export const ensureCurrentFareData = () => {
  if (!storage) {
    return buildInitialFareState();
  }

  try {
    const existing = storage.getItem('currentFareData');
    if (existing) {
      const parsed = JSON.parse(existing);
      return {
        defaultFare: { ...cloneDefaultFare(), ...(parsed?.defaultFare || {}) },
        categoryFares: parsed?.categoryFares || {},
        lastUpdated: parsed?.lastUpdated || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Unable to parse currentFareData, seeding defaults', err);
  }

  const seeded = buildInitialFareState();
  storage.setItem('currentFareData', JSON.stringify(seeded));
  if (!storage.getItem('categoryFareEnabled')) {
    storage.setItem('categoryFareEnabled', JSON.stringify(false));
  }
  return seeded;
};

const normalizeNumber = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeFareEntry = (entry) => ({
  baseFare: normalizeNumber(entry.baseFare, DEFAULT_FARE_SETTINGS.baseFare),
  minimumFare: normalizeNumber(entry.minimumFare, DEFAULT_FARE_SETTINGS.minimumFare),
  farePerKm: normalizeNumber(entry.price, DEFAULT_FARE_SETTINGS.farePerKm),
  idleFee: normalizeNumber(entry.idleFee, DEFAULT_FARE_SETTINGS.idleFee),
  peakHours: normalizeNumber(entry.peakHours, DEFAULT_FARE_SETTINGS.peakHours),
  cancellationFee: normalizeNumber(entry.cancellationFee, DEFAULT_FARE_SETTINGS.cancellationFee),
  minimumCancellationFee: normalizeNumber(entry.minCancellationFee, DEFAULT_FARE_SETTINGS.minimumCancellationFee),
  label: entry.label || `${entry.vehicleType || 'DEFAULT'} Fare`,
});

export const syncFareEntryToStorage = (entry, shouldApplyCategory = false) => {
  if (!storage) {
    return;
  }

  const fareState = ensureCurrentFareData();
  const normalized = normalizeFareEntry(entry);

  fareState.defaultFare = {
    ...fareState.defaultFare,
    ...normalized,
  };

  if (shouldApplyCategory && entry.vehicleType) {
    fareState.categoryFares = {
      ...(fareState.categoryFares || {}),
      [entry.vehicleType]: normalized,
    };
  }

  fareState.lastUpdated = new Date().toISOString();
  storage.setItem('currentFareData', JSON.stringify(fareState));
};

