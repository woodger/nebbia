/**
 * Parses Nebbia template source into the compiler AST.
 *
 * This file owns Nebbia DSL boundary detection and AST node placement.
 * It delegates quote-aware source fragment reading to reader.ts.
 * It must not evaluate JavaScript, generate output code, or define AST node behavior.
 */
import { Node } from '../ast';
/** Parses a full template into the root expression AST node. */
export default function parse(template: string): Node;
