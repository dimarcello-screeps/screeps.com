'use strict';

function run(creep) {
  if (creep.carry.energy === 0) {
    delete creep.memory.transferEnergyStorage;
    return true;
  }
  var transferEnergyStorage;
  if (!creep.memory.transferEnergyStorage ||
      !(transferEnergyStorage = Game.getObjectById(creep.memory.transferEnergyStorage))) {
    transferEnergyStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType == STRUCTURE_STORAGE
        &&
        ((structure.store.energy || 0) + (structure.store.L || 0)) < structure.storeCapacity
    });
  }
  if (!transferEnergyStorage || ((transferEnergyStorage.store.energy || 0) + (transferEnergyStorage.store.L || 0)) === transferEnergyStorage.storeCapacity) {
    delete creep.memory.transferEnergyStorage;
    return true;
  }
  if (creep.transfer(transferEnergyStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(transferEnergyStorage);
  }
  creep.memory.transferEnergyStorage = transferEnergyStorage.id;
}

module.exports = (next, harvest) => {
  return {
    transferEnergyStorage: {
      run,
      next: creep => creep.carry.energy > 0 ? next : harvest
    }
  };
};
