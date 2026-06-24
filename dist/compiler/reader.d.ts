/**
 * Reads source fragments for the Nebbia parser.
 *
 * This file owns cursor movement, balanced delimiter matching, and quoted JavaScript preservation.
 * It must not create AST nodes, recognize Nebbia statements, or generate output code.
 */
/** JavaScript quote characters that can hide template delimiters from the parser. */
export type Quote = '\'' | '"' | '`';
export type ReadResult = {
    /** Parsed substring without outer delimiters. */
    value: string;
    /** Index of the closing delimiter or quote where the reader stopped. */
    end: number;
};
/** Skips leading whitespace before reading a balanced fragment. */
export declare function readBalancedAfter(template: string, start: number, open: string, close: string, quoteDepth: number): ReadResult;
/**
 * Reads a balanced fragment and ignores delimiters that belong to quoted JavaScript.
 *
 * quoteDepth keeps raw template text untouched while still protecting nested JavaScript expressions.
 */
export declare function readBalanced(template: string, start: number, open: string, close: string, quoteDepth: number): ReadResult;
/** Reads a quoted JavaScript fragment as-is, including delimiters and escaped characters. */
export declare function readQuoted(template: string, start: number): ReadResult;
/** Returns the first non-whitespace index at or after start. */
export declare function skipWhitespace(template: string, start: number): number;
/** Skips one optional semicolon after a parsed do...while condition. */
export declare function skipOptionalSemicolon(template: string, start: number): number;
/** Checks whether a character starts a JavaScript quoted fragment. */
export declare function isQuote(char: string): char is Quote;
