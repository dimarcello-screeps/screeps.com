'use strict';

var levels = [
  require('./room.spawn.level-1'),
  require('./room.spawn.level-2'),
  require('./room.spawn.level-4-storage'),
];

module.exports = roles => room => {
  var priorities;
  _.each(levels, level => {
    if (!level.conditions(room)) {
      return;
    }
    priorities = level.priorities;
  });
  if (!priorities) {
    return;
  }

  var order;
  _.each(priorities, priority => {
    if (order) {
      return;
    }
    if (roles[priority.role].roomConditions && !roles[priority.role].roomConditions(room)) {
      return;
    }
    var creeps = room.find(FIND_MY_CREEPS, {
      filter: creep => creep.memory.role === priority.role
    });
    if (creeps.length < priority.amount) {
      order = priority;
    }
  });
  if (!order) {
    return;
  }

  var spawns = room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType == STRUCTURE_SPAWN
  });
  _.each(spawns, spawn => {
    if (!order) {
      return;
    }
    if (spawn.createCreep(order.body, undefined, { role: order.role, activity: roles[order.role].startActivity }) === OK) {
      order = undefined;
    }
  });
};