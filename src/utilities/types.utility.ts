export function isEmptyObject(obj: any) {
  return !Object.values(obj).some(
    (prop) => prop !== null && typeof prop !== 'undefined',
  );
}
