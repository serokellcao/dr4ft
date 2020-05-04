const {sample, pull} = require("lodash");
const Player = require("./player");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(draft_fns = {}) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: ""
    });
    this.callbacks = { "default_pick_indexes": draft_fns.default_pick_indexes };
    if (this.callbacks.default_pick_indexes === undefined)
      this.callbacks.default_pick_indexes = () => [ null ];
    this.autopick_indexes = this.callbacks.default_pick_indexes();
  }

  getPack(pack) {
    logger.debug(`Bot's autopick_indexes are ${this.autopick_indexes}`);
    const randomPick = sample(pack);
    this.picks.push(randomPick.name);
    logger.debug(`Bot picks or burns ${randomPick.name}`);
    pull(pack, randomPick);
    if (this.autopick_indexes.length === 1) {
      this.autopick_indexes = this.callbacks.default_pick_indexes();
      logger.debug(`Bot passes`);
      this.emit("pass", pack);
    } else {
      this.autopick_indexes.splice(0, 1);
      logger.debug(`Bot keeps going`);
      this.getPack(pack);
    }
  }
};
