import { values } from 'lodash'
export const getTestConfigs = state => values(state.testsConfigs)
export const getActiveTest = state => state.testsConfigs[state.activeTest]
export const getActiveTestData = state => getActiveTest(state).data
