import { Lexer } from './lexer/lexer';
import { Parser } from './parser/parser';
import { CodeGenerator } from './generator/code-generator';

// Test code
const sourceCode = `
let x = 42;
function add(a: number, b: number): number {
    return a + b;
}

let result = add(x, 10);
`;

console.log('TypeScript Source Code:');
console.log(sourceCode);

try {
    // Lexical and Syntactic Analysis
    const lexer = new Lexer(sourceCode);
    const parser = new Parser(lexer);
    
    console.log('\nParsing the code...');
    const ast = parser.parse();
    console.log('\nGenerated AST:');
    console.log(JSON.stringify(ast, null, 2));

    // Code Generation
    console.log('\nGenerating JavaScript code...');
    const generator = new CodeGenerator();
    const jsCode = generator.generateProgram(ast);
    
    console.log('\nGenerated JavaScript Code:');
    console.log(jsCode);
} catch (error) {
    console.error('Error during compilation:', error);
} 