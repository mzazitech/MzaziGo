const hasWindow = typeof window !== 'undefined';
const storage = hasWindow ? window.localStorage : null;

const DRIVER_STORAGE_KEY = 'customDrivers';
const PASSENGER_STORAGE_KEY = 'customPassengers';

const read = (key) => {
  if (!storage) return [];
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (key, value) => {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors – data just won't persist.
  }
};

export const getStoredDrivers = () => read(DRIVER_STORAGE_KEY);
export const getStoredPassengers = () => read(PASSENGER_STORAGE_KEY);

export const persistDriver = (driver) => {
  const drivers = getStoredDrivers();
  drivers.push(driver);
  write(DRIVER_STORAGE_KEY, drivers);
};

export const persistPassenger = (passenger) => {
  const passengers = getStoredPassengers();
  passengers.push(passenger);
  write(PASSENGER_STORAGE_KEY, passengers);
};

export const updateStoredDriver = (driver) => {
  const drivers = getStoredDrivers();
  const index = drivers.findIndex((item) => item.id === driver.id);
  if (index === -1) return;
  drivers[index] = driver;
  write(DRIVER_STORAGE_KEY, drivers);
};

export const updateStoredPassenger = (passenger) => {
  const passengers = getStoredPassengers();
  const index = passengers.findIndex((item) => item.id === passenger.id);
  if (index === -1) return;
  passengers[index] = passenger;
  write(PASSENGER_STORAGE_KEY, passengers);
};

