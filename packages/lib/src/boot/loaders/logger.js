import bunyan from 'bunyan';

export default (name) => bunyan.createLogger({
  name,
});