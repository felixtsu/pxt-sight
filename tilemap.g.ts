// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);

    helpers.registerTilemapFactory(function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level": return tiles.createTilemap(hex`0a0008000201010001010101010401030303030303010101010101010101010101010101010101030101010101010101030303030301010103030101010101010101010101010101010305010101030101010106`, img`
. . . . . . . . . . 
. 2 2 2 2 2 2 . . . 
. . . . . . . . . . 
. . . . . 2 . . . . 
. . . . 2 2 2 2 2 . 
. . 2 2 . . . . . . 
. . . . . . . . . 2 
. . . . 2 . . . . . 
`, [myTiles.transparency16,sprites.castle.tilePath5,sprites.castle.tilePath1,sprites.builtin.forestTiles0,sprites.castle.tilePath3,sprites.castle.tilePath7,sprites.castle.tilePath9], TileScale.Sixteen)
            case "level_0": return tiles.createTilemap(hex`0a0008000105050505050505050405050505050506050505050506050506050605050505050506050506050505050506050505060505050505050505050605050505050506060606060502050505050505050503`, img`
. . . . . . . . . . 
. . . . . . 2 . . . 
. . 2 . . 2 . 2 . . 
. . . . 2 . . 2 . . 
. . . 2 . . . 2 . . 
. . . . . . . 2 . . 
. . . . 2 2 2 2 2 . 
. . . . . . . . . . 
`, [myTiles.transparency16,sprites.castle.tilePath1,sprites.castle.tilePath7,sprites.castle.tilePath9,sprites.castle.tilePath3,sprites.castle.tilePath5,sprites.builtin.forestTiles0], TileScale.Sixteen)
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
