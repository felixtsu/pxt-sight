namespace sight {

    const ALERT_RANGE_SPRITE_DATA_KEY = "ALERT_RANGE_SPRITE_DATA_KEY"
    const ALERT_RANGE_SPRITES_SCENE_DATA_KEY = "ALERT_RANGE_SPRITES_SCENE_DATA_KEY"

    export class SightRangeSprite extends Sprite{

        private shaderSprite: Sprite
        private target: Sprite
        private direction: number

        private range: number

        private sightRange: number

        public constructor(target: Sprite, shaderSprite:Sprite, range: number, direction: number, sightRange: number) {
            super(img`.`)

            this.target = target
            this.range = range
            this.direction = direction
            this.sightRange = sightRange

            this.shaderSprite = shaderSprite
            
            this.target.onDestroyed(() => {
                this.shaderSprite.destroy()
            })
        }

        //%blockid=pxtsight_update_sight_direction block="将 %target=variables_get(mySprite) 的视线方向设为 $direction"
        updateDirection(direction: number) {
            this.direction = direction
            this.shaderSprite.destroy()

            this.shaderSprite = createSectionShader(this.range, this.direction, this.sightRange)
        }

        update(){
            this.shaderSprite.x = this.target.x
            this.shaderSprite.y = this.target.y
        }

    }

    //%blockid=pxtsight_sight_range_sprite_of block="在 %sprite=variables_get(mySprite) 上的警戒范围精灵"
    export function sightRangeSpriteOn(sprite:Sprite) :SightRangeSprite{
        return sprites.readDataSprite(sprite, ALERT_RANGE_SPRITE_DATA_KEY) as SightRangeSprite   
    }

    //%blockid=pxtsight_create_sight_shader block="在 %target=variables_get(mySprite) 画出警戒范围，距离$range视线方向$sightDirection视线角度$sightRange"
    //%blockSetVariable="alertRange"
    export function createSectorAlertRange(target: Sprite, range: number, sightDirection: number, sightRange: number) :SightRangeSprite{
        let shaderSprite = createSectionShader(range, sightDirection, sightRange / 2)
        let result =  new SightRangeSprite(target, shaderSprite, range, sightDirection, sightRange / 2)
        sprites.setDataSprite(target, ALERT_RANGE_SPRITE_DATA_KEY,result)

        let alertRangeSprites = game.currentScene().data[ALERT_RANGE_SPRITES_SCENE_DATA_KEY] as SightRangeSprite[]
        if (!alertRangeSprites) {
            game.currentScene().data[ALERT_RANGE_SPRITES_SCENE_DATA_KEY] = alertRangeSprites = [] as SightRangeSprite[]
            game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY + 10, () => {
                let alertRangeSprites = game.currentScene().data[ALERT_RANGE_SPRITES_SCENE_DATA_KEY] as SightRangeSprite[]
                for (let alertRangeSprite of alertRangeSprites) {
                    alertRangeSprite.update()
                }
            })
        }
        alertRangeSprites.push(result)

        return result;
    }

    



    function createSectionShader(range: number, sightDirection: number, sightRange: number): Sprite {
        let result = image.create(range * 2, range * 2)
        for (let degree = sightDirection - sightRange; degree <= sightDirection + sightRange; degree++) {
            let degreeIn360 = (degree + 360) % 360
            let x = range * Math.cos(degreeIn360 / 180 * Math.PI)
            let y = Math.sqrt(range * range - x * x)
            if (degreeIn360 <= 180) {
                y = -y
            }
            result.drawLine(range, range, range + x, range - y, 2)
        }
        return shader.createImageShaderSprite(result, shader.ShadeLevel.One)
    }
}