 //%block="Sprite Sight"
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

    //%block="can $sprite=variables_get(sprite) see $target=variables_get(otherSprite) range %range sightDirection %sightDirection sightRange %sightRange"
    //%blockid=spritesightisinsightcone
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
     //%blockid=spritesightisinsight 
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