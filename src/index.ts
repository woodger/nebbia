// Public package entry point: callable compiler plus CommonJS compatibility.
import nebbia from './compiler';

export type { INebbia } from './compiler';
export default nebbia;

// Legacy require('nebbia') must return the same callable export.
module.exports = nebbia;
