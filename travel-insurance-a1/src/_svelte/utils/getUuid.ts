export const getUuid = () => {
  try {
    if (typeof self !== 'undefined' && self.crypto) {
      return self.crypto.randomUUID();
    }
  } catch (e) {
    // do nothing and fall back to the random UUID generator below
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
