export const isProd = process.env.NODE_ENV === 'production'
export const INT_PORT = process.env.INT_PORT
export const EXP_PORT = process.env.EXP_PORT
export const API = `${
  isProd ? '' : `http://localhost:${process.env.API_PORT}`
}/api`
export const CIRCLE_MARGIN = 20
export const GREY_NEUTRAL = 127
