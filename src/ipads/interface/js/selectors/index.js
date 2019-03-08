import { values } from 'lodash'
export const getActiveTest = state => state.activeTest
export const getActiveTestName = state => state.activeTest && state.activeTest.name
export const getActiveTestId = state => state.activeTest && state.activeTest.id
