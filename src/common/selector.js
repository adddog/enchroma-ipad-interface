import AppStore from 'c:/store'
export const getWidth = () => AppStore.getValue('res').width
export const getHeight = () => AppStore.getValue('res').height
export const getRes = () => AppStore.getValue('res')
export const getRGBFromInterfacePayload = () => {
 if (!AppStore.getValue('interface:touches')) return
 const [deg, r, red, green, blue] = AppStore.getValue(
  'interface:touches',
 )
 return [red, green, blue]
}
export const getXYFromInterfacePayload = () => {
 if (!AppStore.getValue('interface:touches')) return [0,0]
 const val = AppStore.getValue('interface:touches')
 return [val[5] || 0, val[6] || 0]
}
