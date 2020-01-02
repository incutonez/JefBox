// Truly make it a constant by freezing it
const AccessLevels = Object.freeze({
  STANDARD: 1,
  ADMIN: 2,
  SUPER: 3
});

module.exports = AccessLevels;