'use strict';

StructureTower.prototype.attackHostileCreep =
  function () {
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
      this.attack(target);
      return true;
    }
  };

function getDamagedStructures(room, validate) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: structure =>
      validate(structure.structureType)
      &&
      structure.hits < structure.hitsMax
  });
  return structures;
}

function getMostDamagedStructure(room, validate) {
  let structures = getDamagedStructures(room, validate);
  if (structures.length > 0) {
    structures = _.sortBy(structures, structure => structure.hits);
    return structures[0];
  }
}

function repairMostDamagedStructure(room, validate, tower) {
  const structure = getMostDamagedStructure(room, validate);
  if (structure) {
    tower.repair(structure);
    return true;
  }
}

StructureTower.prototype.repairStructure =
  function () {
    return repairMostDamagedStructure(this.room, structureType => structureType !== STRUCTURE_WALL, this);
  };

StructureTower.prototype.repairWall =
  function () {
    return repairMostDamagedStructure(this.room, structureType => structureType === STRUCTURE_WALL, this);
  };
