import { Lexer } from '../lexer/lexer';
import { Token, TokenType } from '../lexer/token';
import * as AST from './ast';

export class Parser {
  private currentToken: Token;

  constructor(private lexer: Lexer) {
    this.currentToken = this.lexer.getNextToken();
  }

  private eat(tokenType: TokenType): void {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(
        `Expected token type ${tokenType}, but got ${this.currentToken.type} at line ${this.currentToken.line}, column ${this.currentToken.column}`
      );
    }
  }

  private parseProgram(): AST.Program {
    const body: AST.Statement[] = [];

    while (this.currentToken.type !== 'EOF') {
      body.push(this.parseStatement());
    }

    return {
      type: 'Program',
      body,
    };
  }

  private parseStatement(): AST.Statement {
    switch (this.currentToken.type) {
      case 'LET':
      case 'CONST':
        return this.parseVariableDeclaration();
      case 'FUNCTION':
        return this.parseFunctionDeclaration();
      case 'RETURN':
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseVariableDeclaration(): AST.VariableDeclaration {
    const kind = this.currentToken.type === 'LET' ? 'let' : 'const';
    this.eat(this.currentToken.type);

    const declarations: AST.VariableDeclarator[] = [];
    
    const id = this.parseIdentifier();
    let init: AST.Expression | null = null;

    if (this.currentToken.type === 'ASSIGN') {
      this.eat('ASSIGN');
      init = this.parseExpression();
    }

    declarations.push({
      type: 'VariableDeclarator',
      id,
      init,
    });

    this.eat('SEMICOLON');

    return {
      type: 'VariableDeclaration',
      kind,
      declarations,
    };
  }

  private parseFunctionDeclaration(): AST.FunctionDeclaration {
    this.eat('FUNCTION');
    const id = this.parseIdentifier();
    
    this.eat('LEFT_PAREN');
    const params = this.parseFunctionParameters();
    this.eat('RIGHT_PAREN');

    let returnType: AST.TypeAnnotation = {
      type: 'TypeAnnotation',
      typeIdentifier: 'void',
    };

    if (this.currentToken.type === 'COLON') {
      this.eat('COLON');
      returnType = this.parseTypeAnnotation();
    }

    const body = this.parseBlockStatement();

    return {
      type: 'FunctionDeclaration',
      id,
      params,
      returnType,
      body,
    };
  }

  private parseFunctionParameters(): AST.Parameter[] {
    const params: AST.Parameter[] = [];

    while (this.currentToken.type !== 'RIGHT_PAREN') {
      const name = this.parseIdentifier();
      
      this.eat('COLON');
      const typeAnnotation = this.parseTypeAnnotation();

      params.push({
        type: 'Parameter',
        name,
        typeAnnotation,
      });

      if (this.currentToken.type === 'COMMA') {
        this.eat('COMMA');
      } else {
        break;
      }
    }

    return params;
  }

  private parseTypeAnnotation(): AST.TypeAnnotation {
    const typeIdentifier = this.currentToken.value;
    this.eat('IDENTIFIER');
    
    return {
      type: 'TypeAnnotation',
      typeIdentifier,
    };
  }

  private parseBlockStatement(): AST.BlockStatement {
    this.eat('LEFT_BRACE');
    const body: AST.Statement[] = [];

    while (this.currentToken.type !== 'RIGHT_BRACE') {
      body.push(this.parseStatement());
    }

    this.eat('RIGHT_BRACE');
    return {
      type: 'BlockStatement',
      body,
    };
  }

  private parseReturnStatement(): AST.ReturnStatement {
    this.eat('RETURN');
    
    let argument: AST.Expression | null = null;
    if (this.currentToken.type !== 'SEMICOLON') {
      argument = this.parseExpression();
    }

    this.eat('SEMICOLON');
    return {
      type: 'ReturnStatement',
      argument,
    };
  }

  private parseExpressionStatement(): AST.ExpressionStatement {
    const expression = this.parseExpression();
    this.eat('SEMICOLON');
    return {
      type: 'ExpressionStatement',
      expression,
    };
  }

  private parseExpression(): AST.Expression {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): AST.Expression {
    const left = this.parseAdditiveExpression();

    if (this.currentToken.type === 'ASSIGN') {
      this.eat('ASSIGN');
      const right = this.parseAssignmentExpression();
      return {
        type: 'BinaryExpression',
        operator: '=',
        left,
        right,
      };
    }

    return left;
  }

  private parseAdditiveExpression(): AST.Expression {
    let left = this.parseMultiplicativeExpression();

    while (
      this.currentToken.type === 'PLUS' ||
      this.currentToken.type === 'MINUS'
    ) {
      const operator = this.currentToken.value;
      this.eat(this.currentToken.type);
      const right = this.parseMultiplicativeExpression();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseMultiplicativeExpression(): AST.Expression {
    let left = this.parseCallExpression();

    while (
      this.currentToken.type === 'MULTIPLY' ||
      this.currentToken.type === 'DIVIDE'
    ) {
      const operator = this.currentToken.value;
      this.eat(this.currentToken.type);
      const right = this.parseCallExpression();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseCallExpression(): AST.Expression {
    const callee = this.parsePrimary();

    if (this.currentToken.type === 'LEFT_PAREN') {
      this.eat('LEFT_PAREN');
      const args: AST.Expression[] = [];

      if (this.currentToken.type !== 'RIGHT_PAREN') {
        args.push(this.parseExpression());

        while (this.currentToken.type === 'COMMA') {
          this.eat('COMMA');
          args.push(this.parseExpression());
        }
      }

      this.eat('RIGHT_PAREN');

      return {
        type: 'CallExpression',
        callee,
        arguments: args,
      };
    }

    return callee;
  }

  private parsePrimary(): AST.Expression {
    switch (this.currentToken.type) {
      case 'IDENTIFIER':
        return this.parseIdentifier();
      case 'NUMBER':
        return this.parseNumericLiteral();
      case 'STRING':
        return this.parseStringLiteral();
      case 'LEFT_PAREN':
        this.eat('LEFT_PAREN');
        const expr = this.parseExpression();
        this.eat('RIGHT_PAREN');
        return expr;
      default:
        throw new Error(
          `Unexpected token type ${this.currentToken.type} at line ${this.currentToken.line}, column ${this.currentToken.column}`
        );
    }
  }

  private parseIdentifier(): AST.Identifier {
    const name = this.currentToken.value;
    this.eat('IDENTIFIER');
    return {
      type: 'Identifier',
      name,
    };
  }

  private parseNumericLiteral(): AST.NumericLiteral {
    const value = Number(this.currentToken.value);
    this.eat('NUMBER');
    return {
      type: 'NumericLiteral',
      value,
    };
  }

  private parseStringLiteral(): AST.StringLiteral {
    const value = this.currentToken.value;
    this.eat('STRING');
    return {
      type: 'StringLiteral',
      value,
    };
  }

  parse(): AST.Program {
    return this.parseProgram();
  }
} 