export const NODE_ENV = process.env.NODE_ENV
export const DEVELOPMENT_MODE = process.env.DEVELOPMENT === 'true' || NODE_ENV === 'test'
export const DEBUG_MODE = process.env.DEBUG === 'true'