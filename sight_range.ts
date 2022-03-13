namespace sight {

    const ALERT_RANGE_SPRITE_DATA_KEY = "ALERT_RANGE_SPRITE_DATA_KEY"
    const ALERT_RANGE_SPRITES_SCENE_DATA_KEY = "ALERT_RANGE_SPRITES_SCENE_DATA_KEY"
    
    export class SightRangeSprite extends Sprite {
        protected shaderSprite: Sprite
        protected target: Sprite
        protected range: number

        public constructor(target: Sprite, shaderSprite: Sprite, range: number) {
            super(img`.`)
            this.target = target
            this.range = range
            this.shaderSprite = shaderSprite
        }

        updatePosition() {
            this.shaderSprite.x = this.target.x
            this.shaderSprite.y = this.target.y
        }
    }

    export class CircularSightRangeSprite extends SightRangeSprite {

        public constructor(target: Sprite, shaderSprite: Sprite, range: number) {
            super(target, shaderSprite, range)
            game.currentScene().physicsEngine.addSprite(this)
            this.target.onDestroyed(() => {
                this.shaderSprite.destroy()
                this.destroy()
            })
        }
    }

    export class ConicalSightRangeSprite extends SightRangeSprite{

        private direction: number
        private sightRange: number

        public constructor(target: Sprite, shaderSprite:Sprite, range: number, direction: number, sightRange: number) {
            super(target, shaderSprite, range)

            this.direction = direction
            this.sightRange = sightRange
        }

        updateDirection(direction: number) {
            this.direction = direction
            this.shaderSprite.destroy()

            this.shaderSprite = createSectionShader(this.range, this.direction, this.sightRange)
        }
    }

    //%blockid=pxtsight_update_sight_direction 
    //%block="set %target=variables_get(mySprite) sight direction to $sightDirection"
    //%block.loc.zh-CN="将 %target=variables_get(mySprite) 的视线方向设为 $sightDirection"
    //%group='锥形视野'
    export function updateSightDirection(target: SightRangeSprite, sightDirection: number) {
        if (target instanceof ConicalSightRangeSprite) {
            let sightRangeSprite = target as ConicalSightRangeSprite
            sightRangeSprite.updateDirection(sightDirection)
        }
    }


    //%blockid=pxtsight_sight_range_sprite_of 
    //% block="Sight range sprite attached to %sprite=variables_get(mySprite)"
    //% block.loc.zh-CN="在 %sprite=variables_get(mySprite) 上的警戒范围精灵"
    export function sightRangeSpriteOn(sprite:Sprite) :SightRangeSprite{
        return sprites.readDataSprite(sprite, ALERT_RANGE_SPRITE_DATA_KEY) as SightRangeSprite   
    }

    //%blockid=pxtsight_create_cone_sight_shader 
    //%block="show sight range of %target=variables_get(mySprite), distance $range direction $sightDirection sightRange $sightRange"
    //%block.loc.zh-CN="在 %target=variables_get(mySprite) 画出锥形警戒范围，距离$range视线方向$sightDirection视线角度$sightRange"
    //%blockSetVariable="sightRangeSprite"
    //%group='锥形视野'
    export function createSectorAlertRange(target: Sprite, range: number, sightDirection: number, sightRange: number): ConicalSightRangeSprite{
        let shaderSprite = createSectionShader(range, sightDirection, sightRange / 2)
        let result =  new ConicalSightRangeSprite(target, shaderSprite, range, sightDirection, sightRange / 2)

        sprites.setDataSprite(target, ALERT_RANGE_SPRITE_DATA_KEY, result)

        registerSightRangeSprite(result)
        
        return result;
    }

    function registerSightRangeSprite(sightRangeSprite:SightRangeSprite) {
        let alertRangeSprites = game.currentScene().data[ALERT_RANGE_SPRITES_SCENE_DATA_KEY] as SightRangeSprite[]
        if (!alertRangeSprites) {
            game.currentScene().data[ALERT_RANGE_SPRITES_SCENE_DATA_KEY] = alertRangeSprites = [] as SightRangeSprite[]
            game.eventContext().registerFrameHandler(scene.UPDATE_PRIORITY + 10, () => {
                let alertRangeSprites = game.currentScene().data[ALERT_RANGE_SPRITES_SCENE_DATA_KEY] as SightRangeSprite[]
                for (let alertRangeSprite of alertRangeSprites) {
                    alertRangeSprite.updatePosition()
                }
            })
        }
        alertRangeSprites.push(sightRangeSprite)
    }
    
    //%blockid=pxtsight_create_circular_sight_shader 
    //%block="show sight range of %target=variables_get(mySprite), distance $range"
    //%block.loc.zh-CN="在 %target=variables_get(mySprite) 画出圆形警戒范围，距离$range"
    //%blockSetVariable="sightRangeSprite"
    //%group='圆形视野'
    export function createCirularAlertRange(target: Sprite, range: number): CircularSightRangeSprite {
        let shaderSprite = createCircularShaderSprite(range)
        let result = new CircularSightRangeSprite(target, shaderSprite, range)
        sprites.setDataSprite(target, ALERT_RANGE_SPRITE_DATA_KEY, result)

        registerSightRangeSprite(result)

        return result;
    }

    function createCircularShaderSprite(range:number) {
        let result = image.create(range*2, range*2) 
        result.fillCircle(range, range, range, 2)
        return shader.createImageShaderSprite(result, shader.ShadeLevel.One)
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