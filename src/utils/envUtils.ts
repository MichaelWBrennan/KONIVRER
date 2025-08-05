export const getEnvVariable = (
  key: string,
  defaultValue: unknown = undefined,
): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env[key]
  ) {
    return import.meta.env[key];
  }
  return defaultValue;
};
