import { values } from 'lodash'
export {
 hasActiveTest,
 getActiveTest,
 getActiveTestData,
} from 'c:/selector'
export const getTestConfigs = state => values(state.testsConfigs)
export const getActiveTestBlock = state => state.activeTestBlock
export const getActiveTestBlockData = state =>
 getActiveTestBlock(state) && state.activeTestBlock.test

export const getActiveTestBlockDataToString = state =>
 getActiveTestBlock(state) &&
 JSON.stringify(state.activeTestBlock.test, null, 4)

export const getTestResults = state => state.testResult
