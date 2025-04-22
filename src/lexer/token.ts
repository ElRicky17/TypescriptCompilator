export type TokenType =
  // Keywords
  | 'LET'
  | 'CONST'
  | 'FUNCTION'
  | 'RETURN'
  | 'IF'
  | 'ELSE'
  | 'WHILE'
  | 'FOR'
  
  // Types
  | 'NUMBER'
  | 'STRING'
  | 'BOOLEAN'
  | 'TYPE'
  | 'IDENTIFIER'
  
  // Operators
  | 'PLUS'
  | 'MINUS'
  | 'MULTIPLY'
  | 'DIVIDE'
  | 'ASSIGN'
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'LESS_THAN'
  | 'GREATER_THAN'
  | 'LESS_THAN_EQUALS'
  | 'GREATER_THAN_EQUALS'
  | 'AND'
  | 'OR'
  | 'NOT'
  
  // Delimiters
  | 'LEFT_PAREN'
  | 'RIGHT_PAREN'
  | 'LEFT_BRACE'
  | 'RIGHT_BRACE'
  | 'LEFT_BRACKET'
  | 'RIGHT_BRACKET'
  | 'SEMICOLON'
  | 'COLON'
  | 'COMMA'
  | 'DOT'
  
  // Special
  | 'EOF';

export class Token {
  constructor(
    public type: TokenType,
    public value: string,
    public line: number,
    public column: number
  ) {}

  toString(): string {
    return `Token(${this.type}, ${this.value}, line=${this.line}, col=${this.column})`;
  }
} 