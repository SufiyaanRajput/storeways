import LocalEventBus from '../../plugins/system/LocalEventBus';

let eventBus = null;

const getEventBus = () => {
  if (!eventBus) {
    eventBus = new LocalEventBus();
  }

  return eventBus;
}

EventBus.prototype.emit = async function(...args) {
  return getEventBus().emit(...args);
};

EventBus.prototype.on = async function(...args) {
    return getEventBus().on(...args);
};

function EventBus() {}

export default EventBus;