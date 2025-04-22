import * as AST from '../parser/ast';

export class CodeGenerator {
  private indentLevel: number = 0;
  private readonly indentString: string = '  ';

  private indent(): string {
    return this.indentString.repeat(this.indentLevel);
  }

  generateProgram(program: AST.Program): string {
    return program.body.map(stmt => this.generateStatement(stmt)).join('\n\n');
  }

  private generateStatement(statement: AST.Statement): string {
    switch (statement.type) {
      case 'VariableDeclaration':
        return this.generateVariableDeclaration(statement);
      case 'FunctionDeclaration':
        return this.generateFunctionDeclaration(statement);
      case 'ReturnStatement':
        return this.generateReturnStatement(statement);
      case 'ExpressionStatement':
        return this.generateExpressionStatement(statement);
      default:
        throw new Error(`Unknown statement type: ${(statement as any).type}`);
    }
  }

  private generateVariableDeclaration(declaration: AST.VariableDeclaration): string {
    const declarations = declaration.declarations
      .map(declarator => {
        const id = this.generateExpression(declarator.id);
        const init = declarator.init ? ` = ${this.generateExpression(declarator.init)}` : '';
        return `${id}${init}`;
      })
      .join(', ');

    return `${this.indent()}${declaration.kind} ${declarations};`;
  }

  private generateFunctionDeclaration(declaration: AST.FunctionDeclaration): string {
    const name = this.generateExpression(declaration.id);
    const params = declaration.params
      .map(param => this.generateExpression(param.name))
      .join(', ');

    this.indentLevel++;
    const body = this.generateBlockStatement(declaration.body);
    this.indentLevel--;

    return `${this.indent()}function ${name}(${params}) ${body}`;
  }

  private generateBlockStatement(block: AST.BlockStatement): string {
    if (block.body.length === 0) {
      return '{}';
    }

    this.indentLevel++;
    const body = block.body
      .map(stmt => this.generateStatement(stmt))
      .join('\n');
    this.indentLevel--;

    return `{\n${body}\n${this.indent()}}`;
  }

  private generateReturnStatement(statement: AST.ReturnStatement): string {
    const argument = statement.argument
      ? ' ' + this.generateExpression(statement.argument)
      : '';
    return `${this.indent()}return${argument};`;
  }

  private generateExpressionStatement(statement: AST.ExpressionStatement): string {
    return `${this.indent()}${this.generateExpression(statement.expression)};`;
  }

  private generateExpression(expression: AST.Expression): string {
    switch (expression.type) {
      case 'BinaryExpression':
        return this.generateBinaryExpression(expression);
      case 'Identifier':
        return this.generateIdentifier(expression);
      case 'NumericLiteral':
        return this.generateNumericLiteral(expression);
      case 'StringLiteral':
        return this.generateStringLiteral(expression);
      case 'CallExpression':
        return this.generateCallExpression(expression);
      default:
        throw new Error(`Unknown expression type: ${(expression as any).type}`);
    }
  }

  private generateBinaryExpression(expression: AST.BinaryExpression): string {
    const left = this.generateExpression(expression.left);
    const right = this.generateExpression(expression.right);
    return `${left} ${expression.operator} ${right}`;
  }

  private generateIdentifier(identifier: AST.Identifier): string {
    return identifier.name;
  }

  private generateNumericLiteral(literal: AST.NumericLiteral): string {
    return literal.value.toString();
  }

  private generateStringLiteral(literal: AST.StringLiteral): string {
    return `"${literal.value}"`;
  }

  private generateCallExpression(expression: AST.CallExpression): string {
    const callee = this.generateExpression(expression.callee);
    const args = expression.arguments
      .map(arg => this.generateExpression(arg))
      .join(', ');
    return `${callee}(${args})`;
  }
} 