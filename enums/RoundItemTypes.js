// Truly make it a constant by freezing it
const RoundItemTypes = Object.freeze({
  TEXT: 1,
  MULTIPLE_CHOICE: 2,
  AUDIO: 3,
  IMAGE: 4,
  VIDEO: 5,
  DRAWING: 6
});

module.exports = RoundItemTypes;