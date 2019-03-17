import { isUndefined } from 'lodash'
import safeStringify from 'fast-safe-stringify'

export const qs = (string, el = document) => el.querySelector(string)

export const getJSON = url =>
 fetch(url, {
  method: 'GET',
 }).then(response => response.json())

export const postJSON = (url, json) =>
 fetch(url, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: safeStringify(json),
 })

export function getRGBStringArray(arr) {
 let [r, g, b] = arr
 return `rgb(${r},${g},${b})`
}

export function getRGBString(r, g, b) {
 g = isUndefined(g) ? r : g
 b = isUndefined(b) ? r : b
 return `rgb(${r},${g},${b})`
}
