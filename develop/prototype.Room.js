'use strict';

const openNeededStructures = require('./memory.openNeededStructures');
const sourcesAmounts = require('./memory.sourcesAmounts');

Room.prototype.hasFlag =
Room.prototype.getFlag =
  function (flagNameRegex) {
    const flags = this.find(FIND_FLAGS, { filter: flag => flagNameRegex.test(flag.name) });
    if (flags.length > 0) {
      return flags[0];
    }
  };

Room.prototype.isHeavyUpgradeable =
  function () {
    if (!openNeededStructures.isFinished(this.name)) {
      return;
    }
    return this.storage && this.storage.isFull({ percentage: 0.75 });
  };

Room.prototype.hasNeighboringSpawnConstructionSite =
Room.prototype.getNeighboringSpawnConstructionSite =
  function () {
    let spawn;
    const exits = Game.map.describeExits(this.name);
    _.each(exits, roomName => {
      const room = Game.rooms[roomName];
      if (!room || !room.controller.my) {
        return;
      }
      const spawns = room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: constructionSite => constructionSite.structureType === STRUCTURE_SPAWN
      });
      if (spawns.length > 0) {
        spawn = spawns[0];
      }
    });
    return spawn;
  };

Room.prototype.getSourcesAmount =
  function () {
    let sourcesAmount;
    if (this.hasFlag(/^source/)) {
      sourcesAmount = 1;
    } else {
      sourcesAmount = sourcesAmounts.getSourcesAmount(this.name);
    }
    return sourcesAmount;
  };
