import EventEmitter from "events";

const eventEmitter = new EventEmitter();

LocalEventBus.prototype.emit = async function (event, payload) {
  try {
    eventEmitter.emit(event, payload);
  } catch (error) {
		console.error('[LOCAL-EVENT-BUS-emit]', error);
	}
};

LocalEventBus.prototype.on = async function (event, callback) {
  eventEmitter.on(event, callback);
};

function LocalEventBus(options = {}) {
  this.name = "local-event-bus";
  this.options = options;
}

export default LocalEventBus;
