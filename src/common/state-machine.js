const STATES = {
 INDUCTION: 'INDUCTION',
 MATCH: 'MATCH',
 REST: 'REST',
}
export default {
 ...STATES,
}

export const isInduction = testBlock =>
 testBlock && testBlock.stateMachine === STATES.INDUCTION
export const isMatch = testBlock =>
 testBlock && testBlock.stateMachine === STATES.MATCH
export const isRest = testBlock =>
 testBlock && testBlock.stateMachine === STATES.REST
