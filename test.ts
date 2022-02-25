// Add your code here
scene.setBackgroundColor(1)

let angle = 0
let sprite:Sprite = null
controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    if (sprite != null) {
        sprite.destroy()
    }
    sprite = sight.createSectionShader(48, angle, 30)
    angle += 30
})