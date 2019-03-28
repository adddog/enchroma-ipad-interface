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

export function downloadJson(data) {
 var dataStr =
  'data:text/json;charset=utf-8,' + encodeURIComponent(data)
 let a = document.createElement('a')
 a.setAttribute('href', dataStr)
 a.setAttribute('download', 'after-image-config.json')
 document.body.appendChild(a)
 a.style.display = 'none'
 a.click()
 document.body.removeChild(a)
}

export function importFile() {
 return new Promise(yes => {
  let a = document.createElement('input')
  a.setAttribute('type', 'file')
  a.addEventListener('change', e => {
   yes(e.target.files[0])
   document.body.removeChild(a)
  })
  document.body.appendChild(a)
  a.style.display = 'none'
  a.click()
 })
}
