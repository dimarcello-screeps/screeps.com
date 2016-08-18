'use strict';

const transformBody = require('./util.transformBody');
const levels = [
  require('./room.spawn.level.1'),
  require('./room.spawn.level.2'),
  require('./room.spawn.level.4'),
  require('./room.spawn.level.4-storage'),
  require('./room.spawn.level.4-storage-full'),

  require('./room.spawn.rescuer')
];

module.exports = roles => room => {
  let highestLevel;
  _.each(levels, level => {
    if (!level.conditions(room)) {
      return;
    }
    highestLevel = level;
  });
  if (!highestLevel) {
    return;
  }

  let spawnOrder;
  _.each(highestLevel.priorities, priority => {
    if (spawnOrder) {
      return;
    }

    if (roles[priority.role].roomConditions && !roles[priority.role].roomConditions(room)) {
      return;
    }

    if (typeof priority.globalAmount === 'number') {
      const globalCreeps = _.filter(Game.creeps, creep => creep.memory.role === priority.role);
      if (globalCreeps.length >= priority.globalAmount) {
        return;
      }
    }

    let amount;
    if (typeof priority.amount === 'function') {
      amount = priority.amount(room);
    } else {
      amount = priority.amount;
    }
    if (typeof amount === 'number') {
      const roomCreeps = room.find(FIND_MY_CREEPS, { filter: creep => creep.memory.role === priority.role });
      if (roomCreeps.length >= amount) {
        return;
      }
    }

    spawnOrder = priority;
  });
  if (!spawnOrder) {
    return;
  }

  const spawns = room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_SPAWN });
  _.each(spawns, spawn => {
    if (!spawnOrder) {
      return;
    }
    const memory = { role: spawnOrder.role, activity: roles[spawnOrder.role].startActivity };
    if (spawn.createCreep(transformBody(highestLevel.bodies[spawnOrder.role]), undefined, memory) !== OK) {
      return;
    }
    spawnOrder = undefined;
  });
};
