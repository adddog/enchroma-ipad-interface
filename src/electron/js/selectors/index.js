import { values } from 'lodash'
export {
 hasActiveTest,
 getActiveTest,
 getActiveTestData,
} from 'c:/selector'
export const getTestConfigs = state => values(state.testsConfigs)
