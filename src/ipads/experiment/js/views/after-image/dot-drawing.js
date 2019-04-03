import Two from "two.js"

export default function drawDot(
  two,
  { radius, strength, numDots, mass }
) {
  var drag = 0.0
  var playing = 0.0

  var background = two.makeGroup()

  var physics = new Physics()
  var points = []
  var i = 0
  for (i = 0; i < numDots; i++) {
    var pct = i / numDots
    var theta = pct * Math.PI * 2

    var ax = radius * Math.cos(theta)
    var ay = radius * Math.sin(theta)

    var variance = Math.random() * 0.5 + 0.5
    var bx = variance * ax
    var by = variance * ay

    var origin = physics.makeParticle(mass, ax, ay)
    var particle = physics.makeParticle(
      Math.random() * mass * 0.66 + mass * 0.33,
      bx,
      by
    )
    var spring = physics.makeSpring(
      particle,
      origin,
      strength,
      drag,
      0
    )

    origin.makeFixed()

    particle.shape = two.makeCircle(
      particle.position.x,
      particle.position.y,
      1
    )
    particle.shape.noStroke().noFill()
    particle.position = particle.shape.translation

    points.push(particle.position)
  }

  var outer = new Two.Path(points, true, true).noStroke()
  var color = "#222"
  outer.fill = color.toString(0.5)

  background.add(outer)

  resize()

  function update() {
    physics.update()
  }

  two.bind("resize", resize).play()

  function resize() {
    background.translation.set(two.width / 2, two.height / 2)
  }

  function pause() {
    two.unbind("update", update)
    background.opacity = 0
  }

  function resume() {
    two.bind("update", update)
    background.opacity = 1
  }

  return {
    pause,
    resume,
  }
}
