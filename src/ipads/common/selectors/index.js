import { values } from 'lodash'

export const getActiveTest = state => state.activeTest
export const getActiveTestId = state =>
 state.activeTest && state.activeTest.id
export const getActiveTestData = state =>
 state.activeTest && getActiveTest(state).data
export const getActiveTestBlock = state =>
 state.activeTest &&
 getActiveTestData(state).phases[getActiveTestIndex(state)]
export const getActiveTestIndex = state =>
 state.activeTest && state.activeTest.index
export const getActiveTestName = state =>
 state.activeTest && state.activeTest.name

export const getIsPaused = state => state.paused
export const getIsWaiting = state => state.waiting
