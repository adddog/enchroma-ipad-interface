import { API } from 'c:/constants'
import { postJSON } from 'i:lib/util'

export default {
  setActiveTest: data => {
    console.log(data);
    postJSON(API, { action: 'setActiveTest', data })
  },
  refresh: data => {
    postJSON(API, { action: 'refresh' })
  },
}
