 //%block="Sprite Sight"
 //%groups=["锥形视野","圆形视野"]
//% weight=100 color=#E29E28 icon=""
namespace sight{

    
    let showTestingTiles = false

    function distanceInRange(sprite:Sprite, target:Sprite, range:number) {
        return Math.sqrt(Math.pow(sprite.x - target.x, 2) + Math.pow(sprite.y - target.y, 2)) <= range
    }
    
    function currentScale() {
        return game.currentScene().tileMap.scale
    }

    function scaleDelta() {
        return 1 << currentScale()
    }

    const SPRITE_KIND_TESTING = SpriteKind.create()

    function placeTestSprite(col:number, row:number, h:Image) {
        if (showTestingTiles) {
            let testSprite = sprites.create(h, SPRITE_KIND_TESTING)
            tiles.placeOnTile(testSprite, tiles.getTileLocation(col, row))        
        }
    }


    function isWallBetween(start:Sprite, end:Sprite) {
        if (showTestingTiles) {
            for (let sprite of sprites.allOfKind(SPRITE_KIND_TESTING)) {
                sprite.destroy()
            }
        }

        // always from left to right
        if (start.x > end.x) {
            let temp = start
            start = end
            end = temp
        }

        let slope = (end.y - start.y) / (end.x - start.x)
        let ySign = (end.y > start.y) ? 1 : -1 

        // points at column boundaries
        let boundaryPoints = []
        for (let x = start.x  + scaleDelta() - start.x % scaleDelta(), y = start.y + (scaleDelta() - start.x % scaleDelta())*slope ; x < end.x; x += scaleDelta(), y+= scaleDelta()*slope) {
            boundaryPoints.push([x, y])
        }

        // for each points on vertical lines, check if tile to the right isObstacle
        for (let boundaryPoint of boundaryPoints) {
            let [col, row] = [boundaryPoint[0] >> currentScale(), boundaryPoint[1] >> currentScale() ]
            placeTestSprite(col, row, img`
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
                c c c c c c c c c c c c c c c c
            `)
            if (game.currentScene().tileMap.isObstacle(col, row)) {
                return true
            } 
        }

        boundaryPoints = []
    
        if (ySign > 0) {
            let x = start.x + (scaleDelta() - (start.y % scaleDelta())) / slope 
            let y = start.y - (start.y % scaleDelta())  + scaleDelta() 

            while((y < end.y)) {
                boundaryPoints.push([x, y])
                y += scaleDelta(), 
                x += scaleDelta()/slope
            } 

        } else { 
            let x = start.x - (start.y % scaleDelta()) / slope 
            let y = start.y - (start.y % scaleDelta())  

            while((y > end.y)) {
                boundaryPoints.push([x, y])
                y -= scaleDelta(), 
                x -= scaleDelta()/slope
            } 

        }

        // for each points on horizontal lines, check if tile to the up/down (sign) isObstacle
        for (let boundaryPoint of boundaryPoints) {
            let [col, row] = [boundaryPoint[0] >> currentScale(), (boundaryPoint[1] >> currentScale()) + (ySign>0?0:-1) ]
            placeTestSprite(col, row, img`
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            `)
            if (game.currentScene().tileMap.isObstacle(col, row)) {
                return true
            } 
        }

        return false
    }

    export function toggleTestingTiles(on:boolean) {
        showTestingTiles = on
    }


    function isPointInRange(x: number, y: number, 
            angle_lower_in_360: number, angle_upper_in_360:number): boolean {
        let angle = Math.atan2(y, x) / Math.PI * 180
        let pointAngleIn360 = (angle + 360) % 360
        console.log(pointAngleIn360)
        return pointAngleIn360 >= angle_lower_in_360 && pointAngleIn360 <= angle_upper_in_360
    }
    function isInRange(x:number, y:number,
        sightDirection:number, sightRange:number) {
            let angle = Math.atan2(y, x) / Math.PI * 180
        let pointAngleIn360 = (angle + 360) % 360
        let result = Math.abs(sightDirection - pointAngleIn360) <= sightRange
        return result
    }

    
    // export function createSectionShader(range:number, sightDirection : number, sightRange : number) :Sprite{
    //     let result = image.create(range * 2, range * 2) 
    //     for (let i = 0; i < 2* range ; i++) {
    //         // 1 遍历每一行，找到应该画出的左右侧点，然后用drawLine去画这一行

    //         // 当前的deltaY，到圆心的距离
    //         let h = i - range
            
    //         // 勾股定理算出左右两侧偏移x
    //         let deltaX = Math.round(Math.sqrt(range * range - h * h))
    //         let x0 = range - deltaX
    //         let x1 = range + deltaX

    //         if( Math.abs(h) == 10) {
    //             console.log(`${x0},${x1}`)
    //         }

    //         // console.log(`${angle_lower_in_360}, ${angle_upper_in_360}`)

    //         if (i == range || i == range + 1) {
    //             // 中间两行需要特殊处理(h/tan为infinity)
    //             x0 = range, x1 = range
    //             // 如果 0 / 180 在sightRange内，修改左右两端最远点
    //             if (Math.abs(sightDirection - 0) <= sightRange) {
    //                 x1 = range * 2
    //             } 
    //             if (Math.abs(sightDirection - 180) <= sightRange) {
    //                 x0 = 0
    //             } 

    //             result.drawLine(x0, i, x1, i, 2)

    //         } else {
    //             let angle_lower_degrees = sightDirection - sightRange
    //             let angle_upper_degrees = sightDirection + sightRange

    //             let angle_lower_in_360 = (angle_lower_degrees + 360) % 360
    //             let angle_upper_in_360 = (angle_upper_degrees + 360) % 360

    //             // 看一下是否在范围内，超出范围的话，就需要调整为边沿的x
    //             let x_min = h / Math.tan(angle_lower_in_360 / 180 * Math.PI) + range
    //             let x_max = h / Math.tan(angle_upper_in_360 / 180 * Math.PI) + range

    //             if (x_min > x_max) {
    //                 let temp = x_min
    //                 x_min = x_max
    //                 x_max = x_min
    //             }

    //             // if (!isInRange(x_min, h, sightDirection, sightRange)) {
    //             //     x_min = range
    //             // }
    //             // if (!isInRange(x_max, h, sightDirection, sightRange)) {
    //             //     x_max = range
    //             // }

    //             if (!isInRange(-deltaX, h, sightDirection, sightRange)) {
    //                 x0 = x_min
    //             }

    //             if (!isInRange(deltaX, h, sightDirection, sightRange)) {
    //                 x1 = x_max
    //             }
                
    //             if (x1 > x0) {
    //                 result.drawLine(x0, i, x1, i, 2)
    //             }
                
                
                
    //         }

    //         // if (angle_lower == 90 || angle_lower == -90) {
    //         //     x0 = 0
    //         //     x_min = 0
    //         // }
    //         // if (angle_upper == 90 || angle_upper == -90) {
    //         //     x1 = range * 2
    //         //     x_max = range * 2
    //         // }
    //         // // 如果x0 不在范围内，则利用小值
    //         // let x_lower = Math.min(x_min, x_max)
    //         // let x_upper = Math.max(x_min, x_max)
    //         // // if (h == 10) {
    //         //     console.log(`(${x0}, ${x1}, ${x_lower},${x_upper})`)
    //         // // }
    //         // x0 = Math.max(x0, x_lower)
    //         // x1 = Math.min(x1, x_upper)
    
            
    //     }
    //     return shader.createImageShaderSprite(result, shader.ShadeLevel.Two)
    // }

    //%block="can $sprite=variables_get(sprite) see $target=variables_get(otherSprite) range %range sightDirection %sightDirection sightRange %sightRange"
    //%block.loc.zh-CN="$sprite=variables_get(sprite) 能看到 $target=variables_get(otherSprite) 吗？视线范围(距离 %range 方向 %sightDirection 角度范围 %sightRange)"
    //%blockid=spritesightisinsightcone
    //%group='锥形视野'
    export function isInSightCone(sprite:Sprite, target:Sprite, range:number, sightDirection:number, sightRange:number) {
        if (!distanceInRange(sprite, target, range)) {
            return false
        }

        if (isWallBetween(sprite, target)) {
            return false
        }

        let angle = Math.atan2(target.y - sprite.y, target.x - sprite.x)
        
        angle = ((angle / Math.PI * 180 ) + 360 )% 360
        sightDirection = (sightDirection + 360 )% 360
        return Math.abs(angle - sightDirection) < sightRange
    }

    //%block="can $sprite=variables_get(sprite) see $target=variables_get(otherSprite) range %range %omitWalls"
    //%block.loc.zh-CN="$sprite=variables_get(sprite) 能看到 $target=variables_get(otherSprite) 吗？范围(距离 %range 忽略墙体 %omitWalls)"
     //%blockid=spritesightisinsight 
     //%group='圆形视野'
    export function isInSight(sprite:Sprite, target:Sprite, range:number, omitWalls:boolean) {
        if (!distanceInRange(sprite, target, range)) {
            return false 
        }
        
        if (omitWalls) {
            return true
        }

        return !isWallBetween(sprite, target)
    }

}