import Color from 'color'
export const isProd = process.env.NODE_ENV === 'production'
export const isDev = process.env.NODE_ENV !== 'production'
export const isDevTest = process.env.DEV_TEST != 'false'
export const PLATFORM = process.env.PLATFORM
export const ASSET_PATH = isProd ? `${PLATFORM}/assets` : "assets"
export const INT_PORT = process.env.INT_PORT
export const EXP_PORT = process.env.EXP_PORT
export const API_PORT = process.env.API_PORT
export const API = `${
 isProd ? '' : `http://localhost:${process.env.API_PORT}`
}/api`
export const CIRCLE_MARGIN = 80
export const CIRCLE_STROKE_WIDTH = 3
export const GREY_NEUTRAL = 127
export const GREY_COLOR = Color.rgb(
 GREY_NEUTRAL,
 GREY_NEUTRAL,
 GREY_NEUTRAL,
)
export const RGB_GREY_NEUTRAL = `rgb(${GREY_NEUTRAL},${GREY_NEUTRAL},${GREY_NEUTRAL})`
export const RGB_GREY_NEUTRAL_DARK = GREY_COLOR.darken(0.5)
 .rgb()
 .string()
export const RGB_GREY_NEUTRAL_LIGHTEST = GREY_COLOR.lighten(0.5)
 .rgb()
 .string()
