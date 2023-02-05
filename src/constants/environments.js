export const NODE_ENV = process.env.NODE_ENV;
export const DEVELOPMENT_MODE = process.env.DEVELOPMENT === 'true' ||
  NODE_ENV === 'development' ||
  NODE_ENV === 'test'
