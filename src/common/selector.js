import { isEmpty } from 'lodash'
import AppStore from 'c:/store'

export const getWidth = () => AppStore.getValue('res').width
export const getHeight = () => AppStore.getValue('res').height
export const getRes = () => AppStore.getValue('res')
export const getRGBFromInterfacePayload = payload => {
 if (!AppStore.getValue('interface:touches') && !payload) return
 const [deg, r, red, green, blue] =
  payload || AppStore.getValue('interface:touches')
 return [red, green, blue]
}
export const getXYFromInterfacePayload = payload => {
 if (!AppStore.getValue('interface:touches') && !payload)
  return [0, 0]
 const val = payload || AppStore.getValue('interface:touches')
 return [val[5] || 0, val[6] || 0]
}

/* ************
 *  MODEL
 ************ */
export const hasActiveTest = state => !isEmpty(state.activeTest)
export const getActiveTestId = state =>
 state.activeTest && state.activeTest.id
export const getActiveTestIndex = state =>
 state.activeTest && state.activeTest.index
export const getActiveTest = state =>
 state.testsConfigs[getActiveTestId(state)]
export const getActiveTestData = state => getActiveTest(state).data
export const getBlockFromIndex = (testData, index) =>
 testData.phases[index]
export const getActiveTestBlock = state =>
 getActiveTestData(state).phases[getActiveTestIndex(state)]
