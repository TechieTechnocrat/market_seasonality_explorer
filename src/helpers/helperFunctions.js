export const helperFunctions = {
  JPJS: (v) => {
    return JSON.parse(JSON.stringify(v));
  },
};

export const formatFieldLabel = (fieldName) => {
  return fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const JPJS = (value) => {
  return JSON.parse(JSON.stringify(value));
};
