import type { INebbia as Nebbia } from '../dist/compiler/index.js';

declare const nebbia: Nebbia;

declare namespace nebbia {
  type INebbia = Nebbia;
}

export = nebbia;
