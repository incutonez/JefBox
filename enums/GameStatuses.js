// Truly make it a constant by freezing it
const GameStatuses = Object.freeze({
  NEW: 0,
  RUNNING: 1,
  PAUSED: 2,
  COMPLETED: 3,
  DELETED: 4
});

module.exports = GameStatuses;