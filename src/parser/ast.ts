// AST Node Types
export interface Node {
  type: string;
}

export interface Program extends Node {
  type: 'Program';
  body: Statement[];
}

export type Statement =
  | VariableDeclaration
  | FunctionDeclaration
  | ReturnStatement
  | ExpressionStatement;

export interface VariableDeclaration extends Node {
  type: 'VariableDeclaration';
  kind: 'let' | 'const';
  declarations: VariableDeclarator[];
}

export interface VariableDeclarator extends Node {
  type: 'VariableDeclarator';
  id: Identifier;
  init: Expression | null;
}

export interface FunctionDeclaration extends Node {
  type: 'FunctionDeclaration';
  id: Identifier;
  params: Parameter[];
  returnType: TypeAnnotation;
  body: BlockStatement;
}

export interface Parameter extends Node {
  type: 'Parameter';
  name: Identifier;
  typeAnnotation: TypeAnnotation;
}

export interface TypeAnnotation extends Node {
  type: 'TypeAnnotation';
  typeIdentifier: string;
}

export interface BlockStatement extends Node {
  type: 'BlockStatement';
  body: Statement[];
}

export interface ReturnStatement extends Node {
  type: 'ReturnStatement';
  argument: Expression | null;
}

export interface ExpressionStatement extends Node {
  type: 'ExpressionStatement';
  expression: Expression;
}

export type Expression =
  | BinaryExpression
  | Identifier
  | NumericLiteral
  | StringLiteral
  | CallExpression;

export interface BinaryExpression extends Node {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface Identifier extends Node {
  type: 'Identifier';
  name: string;
}

export interface NumericLiteral extends Node {
  type: 'NumericLiteral';
  value: number;
}

export interface StringLiteral extends Node {
  type: 'StringLiteral';
  value: string;
}

export interface CallExpression extends Node {
  type: 'CallExpression';
  callee: Expression;
  arguments: Expression[];
} 