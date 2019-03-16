const COLROS = [
 'Blue',
 'BlueViolet',
 'Brown ',
 'BurlyWood ',
 'CadetBlue ',
 'Chartreuse',
 'Chocolate ',
 'Coral ',
 'CornflowerBlue',
]
module.exports = (() => {
 let two
 let _groupIndex = 0
 let _pointsGroups = []

 const pointGroup = () => {
  if (!_pointsGroups[_groupIndex]) {
   _pointsGroups[_groupIndex] = []
  }
  return _pointsGroups[_groupIndex]
 }
 function init(x) {
  two = x
 }
 function addPoint({ pos }) {
  const [x, y] = pos
  const group = pointGroup()
  if (!group.length) {
   group.push([])
  }
  const groupActive = group[group.length - 1]
  groupActive.push({ x, y })
  if (groupActive.length > 1) {
   const line = two.makeLine(
    groupActive[groupActive.length - 2].x,
    groupActive[groupActive.length - 2].y,
    groupActive[groupActive.length - 1].x,
    groupActive[groupActive.length - 1].y,
   )
   line.stroke = COLROS[_groupIndex]
   two.update()
  }
 }
 function touchEnd() {
  const group = pointGroup()
  group.push([])
 }

 return {
  init,
  addPoint,
  touchEnd,
 }
})()
