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
  body: JSON.stringify(json),
 })
