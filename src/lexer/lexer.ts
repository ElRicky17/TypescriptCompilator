import { Token, TokenType } from './token';

export class Lexer {
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private startColumn: number = 1;

  constructor(private source: string) {}

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private advance(): void {
    if (this.currentChar() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  private currentChar(): string {
    return this.source[this.position] || '\0';
  }

  private peek(): string {
    return this.currentChar();
  }

  private peekNext(): string {
    return this.source[this.position + 1] || '\0';
  }

  private createToken(type: TokenType, value: string): Token {
    const token = new Token(type, value, this.line, this.column);
    this.startColumn = this.column;
    return token;
  }

  private skipWhitespace(): void {
    while (this.isWhitespace(this.peek())) {
      this.advance();
    }
  }

  private skipComment(): void {
    // Skip //
    this.advance();
    this.advance();

    // Skip until end of line
    while (this.peek() !== '\n' && this.peek() !== '\0') {
      this.advance();
    }
  }

  private readString(): Token {
    this.startColumn = this.column;
    this.advance(); // Skip opening quote
    let value = '';

    while (this.peek() !== '"' && this.peek() !== '\0') {
      if (this.peek() === '\\') {
        this.advance();
        switch (this.peek()) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '"': value += '"'; break;
          case '\\': value += '\\'; break;
          default: value += this.peek();
        }
      } else {
        value += this.peek();
      }
      this.advance();
    }

    if (this.peek() === '"') {
      this.advance(); // Skip closing quote
    } else {
      throw new Error(`Unterminated string at line ${this.line}, column ${this.column}`);
    }

    return this.createToken('STRING', value);
  }

  private readNumber(): Token {
    this.startColumn = this.column;
    let value = '';
    while (this.isDigit(this.peek())) {
      value += this.peek();
      this.advance();
    }

    // Handle decimal numbers
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += '.';
      this.advance();

      while (this.isDigit(this.peek())) {
        value += this.peek();
        this.advance();
      }
    }

    return this.createToken('NUMBER', value);
  }

  private readIdentifier(): Token {
    let identifier = '';
    while (this.isAlphaNumeric(this.peek())) {
      identifier += this.peek();
      this.advance();
    }

    const tokenType = this.getKeywordTokenType(identifier);
    return this.createToken(tokenType, identifier);
  }

  private getKeywordTokenType(keyword: string): TokenType {
    switch (keyword) {
      case 'let': return 'LET';
      case 'const': return 'CONST';
      case 'function': return 'FUNCTION';
      case 'return': return 'RETURN';
      case 'if': return 'IF';
      case 'else': return 'ELSE';
      case 'while': return 'WHILE';
      case 'for': return 'FOR';
      case 'true': return 'BOOLEAN';
      case 'false': return 'BOOLEAN';
      case 'void': return 'TYPE';
      case 'number': return 'TYPE';
      case 'string': return 'TYPE';
      case 'boolean': return 'TYPE';
      default: return 'IDENTIFIER';
    }
  }

  getNextToken(): Token {
    this.skipWhitespace();

    if (this.position >= this.source.length) {
      return this.createToken('EOF', '');
    }

    const char = this.peek();

    if (this.isAlpha(char)) {
      return this.readIdentifier();
    }

    if (this.isDigit(char)) {
      return this.readNumber();
    }

    if (char === '"' || char === "'") {
      return this.readString();
    }

    // Handle operators and special characters
    switch (char) {
      case '+':
        this.advance();
        return this.createToken('PLUS', '+');
      case '-':
        this.advance();
        return this.createToken('MINUS', '-');
      case '*':
        this.advance();
        return this.createToken('MULTIPLY', '*');
      case '/':
        if (this.peek() === '/') {
          this.skipComment();
          return this.getNextToken();
        }
        this.advance();
        return this.createToken('DIVIDE', '/');
      case '=':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken('EQUALS', '==');
        }
        return this.createToken('ASSIGN', '=');
      case '!':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken('NOT_EQUALS', '!=');
        }
        return this.createToken('NOT', '!');
      case '<':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken('LESS_THAN_EQUALS', '<=');
        }
        return this.createToken('LESS_THAN', '<');
      case '>':
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          return this.createToken('GREATER_THAN_EQUALS', '>=');
        }
        return this.createToken('GREATER_THAN', '>');
      case '&':
        this.advance();
        if (this.peek() === '&') {
          this.advance();
          return this.createToken('AND', '&&');
        }
        throw new Error(`Unexpected character: ${char}`);
      case '|':
        this.advance();
        if (this.peek() === '|') {
          this.advance();
          return this.createToken('OR', '||');
        }
        throw new Error(`Unexpected character: ${char}`);
      case '(':
        this.advance();
        return this.createToken('LEFT_PAREN', '(');
      case ')':
        this.advance();
        return this.createToken('RIGHT_PAREN', ')');
      case '{':
        this.advance();
        return this.createToken('LEFT_BRACE', '{');
      case '}':
        this.advance();
        return this.createToken('RIGHT_BRACE', '}');
      case '[':
        this.advance();
        return this.createToken('LEFT_BRACKET', '[');
      case ']':
        this.advance();
        return this.createToken('RIGHT_BRACKET', ']');
      case ';':
        this.advance();
        return this.createToken('SEMICOLON', ';');
      case ':':
        this.advance();
        return this.createToken('COLON', ':');
      case ',':
        this.advance();
        return this.createToken('COMMA', ',');
      case '.':
        this.advance();
        return this.createToken('DOT', '.');
      default:
        throw new Error(`Unexpected character: ${char}`);
    }
  }
} 