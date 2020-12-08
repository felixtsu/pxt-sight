// 在此处添加您的代码
namespace sight {

    function judgeByDistance(sprite:Sprite, target:Sprite, range:number) {
        return Math.sqrt(Math.pow(sprite.x - target.x, 2) + Math.pow(sprite.y - target.y, 2)) <= range
    }
    
    function currentScale() {
        return game.currentScene().tileMap.scale
    }


    function isWallBetween2(start:Sprite, end:Sprite) {
        // always from left to right
        if (start.x > end.x) {
            let temp = start
            start = end
            end = start
        }

        let slope = (end.y - start.y) / (end.x - start.x)
        let sign = (end.y > start.y) ? 1 : -1 

        // points at column boundaries
        let boundaryPoints = []
        for (let x = start.x  + currentScale() - start.x % currentScale(), y = start.y + currentScale() - start.y % currentScale(); x < end.x; x += currentScale(), y+= currentScale()*sign*slope) {
            boundaryPoints.push([x, y])
        }

        // for each points on vertical lines, check tile to the right is isWallBetween
        for (let boundaryPoint of boundaryPoints) {
            if (game.currentScene().tileMap.isObstacle(boundaryPoint[0] / currentScale(), boundaryPoint[1] / currentScale())) {
                return true
            }
        }

        boundaryPoints = []

        for (let x = start.x  + currentScale() - start.x % currentScale(), y = start.y + currentScale() - start.y % currentScale(); (y - end.y)*sign > 0; y += currentScale()*sign, x+= currentScale()/slope) {
            boundaryPoints.push([x, y])
        }

        // for each points on horizontal lines, check tile to the up/down (sign) is isWallBetween
        for (let boundaryPoint of boundaryPoints) {
            if (game.currentScene().tileMap.isObstacle(boundaryPoint[0] / currentScale(), boundaryPoint[1] / currentScale() + sign>0?1:0 )) {
                return true
            }
        }

        return false
    }


    function isWallBetween(sprite:Sprite, target:Sprite) {
        const currentTileMap = game.currentScene().tileMap

        const angle = Math.atan2(target.y - sprite.y, target.x - sprite.x)

        let [startRow, startCol] = [sprite.x / currentTileMap.scale, sprite.y / currentTileMap.scale]
        let [endRow, endCol] = [target.x / currentTileMap.scale, target.y / currentTileMap.scale]

        // always from left to right
        if (startRow > endRow) {
            let tempRow = endRow
            endRow = startRow
            startRow = endRow

            let tempCol = endCol
            endCol = startCol
            startCol = endCol
            
        }

        while (startRow != endRow && startCol != endCol) {
            if (game.currentScene().tileMap.isObstacle(startRow, startCol) ) {
                return true;
            }

            if (true) {
                startCol += 1
            } else {
                endRow += endRow > startRow ? 1 : -1  
            }
            
            

        }
        return false;
    }
    


    export function isInSight(sprite:Sprite, target:Sprite, range:number, omitWalls:boolean) {
        if (!judgeByDistance(sprite, target, range)) {
            return false 
        }
        
        if (omitWalls) {
            return true
        }

        return isWallBetween2(sprite, target)
        
    }

}