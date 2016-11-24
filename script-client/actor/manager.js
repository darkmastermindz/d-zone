'use strict';
var util = require('dz-util');
var Geometry = require('geometry');
var EntityManager = require('man-entity');
var WorldManager = require('world/manager');
var RenderManager = require('man-render');
var actorConfig = require('./config');

var ACTOR = require('./components/actor');
var SPRITE3D = require('com-sprite3d');
var TRANSFORM = require('com-transform');
var MOVEMENT = require('./components/movement');

var placedIndexes = [WorldManager.world.tiles.indexFromXY(WorldManager.world.radius, WorldManager.world.radius)];
var placeZ = 0;

module.exports = {
    create(params) {
        params = params || {};
        if(isNaN(params.x) && isNaN(params.y) && isNaN(params.z)) {
            var random = WorldManager.world.tiles.getRandomTile([2,3], placedIndexes);
            if(!random) {
                placeZ++;
                placedIndexes = placedIndexes.slice(0,1);
                random = WorldManager.world.tiles.getRandomTile([2,3], placedIndexes);
            }
            params.x = WorldManager.unCenter(random.xy.x);
            params.y = WorldManager.unCenter(random.xy.y);
            params.z = placeZ;
        }
        var data = [
            [ACTOR],
            [TRANSFORM, params], // Transform must be before sprite so render manager sees it when sprite is added
            [SPRITE3D, actorConfig().sprites.idle[util.pickInObject(Geometry.DIRECTIONS)]] // Face random direction
        ];
        var e = EntityManager.addEntity(data);
        var transform = WorldManager.addEntity(e);
        placedIndexes.push(transform.mapIndex % WorldManager.world.tiles.area);
        return e;
    },
    hop(entity, direction) {
        if(EntityManager.hasComponent(entity, MOVEMENT)) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction: direction });
    }
};