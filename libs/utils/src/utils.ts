type NumberUnit = 'K' | 'M' | 'B' | 'T' | 'P' | 'E';

export function shortenNumber(rawNumber: number) {
  if (rawNumber < 1000) {
    return rawNumber;
  }

  const si: { v: number; s: NumberUnit }[] = [
    { v: 1e3, s: 'K' },
    { v: 1e6, s: 'M' },
    { v: 1e9, s: 'B' },
    { v: 1e12, s: 'T' },
    { v: 1e15, s: 'P' },
    { v: 1e18, s: 'E' },
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (rawNumber >= si[index].v) {
      break;
    }
  }
  return (
    (rawNumber / si[index].v)
      .toFixed(2)
      .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[index].s
  );
}

export function random() {
  return Math.floor(Math.random() * 10);
}

export function generateShort(value: string) {
  let code = '';
  value.split(' ').forEach((word, index) => {
    if (word.length > 0) {
      if (index === 0) code = `${code}${word[0].toUpperCase()}`;
      if (word.length > 3 && index !== 0)
        code = `${code}${word[0].toUpperCase()}`;
    }
  });
  return code;
}

/**
 * @description This is the object implementation of Omit<T, K> type.
 * @param obj Object to exclude keys from of type T
 * @param keys keys to exclude
 * @returns an object of type Omit<T, K>
 */
export function excludeKeys<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  keys.forEach((key) => {
    delete obj[key];
  });
  return obj;
}

/**
 * @description This is the object implementation of Pick<T, K> type.
 * @param obj Object to pick keys from
 * @param keys picked keys
 */
export function pickKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key as K)) delete obj[key as keyof T];
  });
  return obj;
}
