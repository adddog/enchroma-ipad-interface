import { isEmpty } from "lodash"
import AppStore from "c:/store"
/* **************
 *  APP STORE
 ************** */
export const getWidth = () => AppStore.getValue("res").width
export const getHeight = () => AppStore.getValue("res").height
export const getRes = () => AppStore.getValue("res")

export const getRGBFromInterfacePayload = (
  payload,
  isGreyscale = AppStore.getValue("isGreyscale")
) => {
  if (!AppStore.getValue("interface:touches") && !payload) return
  const touches = payload || AppStore.getValue("interface:touches")

  return isGreyscale
    ? getGreyscaleFromInterfacePayload(touches)
    : getColorFromInterfacePayload(touches)
}
export const getColorFromInterfacePayload = payload => {
  const [rad, phi, r, g, b] = payload
  return [r, g, b]
}
export const getGreyscaleFromInterfacePayload = payload => {
  const c = Math.floor(payload[8][0] * 2 * 255)
  return [c, c, c]
}

export const getXYFromInterfacePayload = payload => {
  if (!AppStore.getValue("interface:touches") && !payload)
    return [0, 0]
  const val = payload || AppStore.getValue("interface:touches")
  return [val[5] || 0, val[6] || 0]
}
export const hasInterfaceTouches = () =>
  !!AppStore.getValue("interface:touches")
export const getInterfaceTouches = () =>
  AppStore.getValue("interface:touches")

/* ************
 *  MODEL
 ************ */
export const hasActiveTest = state => !isEmpty(state.activeTest)
export const getActiveTestId = state =>
  state.activeTest && state.activeTest.id
export const getActiveTestIndex = state =>
  state.activeTest && state.activeTest.index
export const getActiveTest = state => state.activeTest
export const getActiveConfigTest = state =>
  state.activeTest && state.testsConfigs[getActiveTestId(state)]
export const getActiveTestData = state =>
  (state.activeTest && state.activeTest.data) ||
  getActiveConfigTest(state).data
export const getBlockFromIndex = (testData, index) =>
  testData.phases[index]
export const getActiveTestBlock = state =>
  getActiveTestData(state).phases[getActiveTestIndex(state)]
