// Публичная точка входа пакета: callable compiler и CommonJS compatibility.
import nebbia from './compiler';

export type { INebbia } from './compiler';
export default nebbia;

// Исторический require('nebbia') должен возвращать тот же callable export.
module.exports = nebbia;
