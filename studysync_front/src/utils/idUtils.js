export const getSafeId = (obj) => {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (typeof obj === 'string' || typeof obj === 'number') {
    return obj;
  }

  return obj.id || obj._id || obj.event_id;
};
