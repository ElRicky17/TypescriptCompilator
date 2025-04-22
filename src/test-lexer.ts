import { Lexer } from './lexer/lexer';

// Test code
const sourceCode = `
// Variable declarations
let x = 42;
const y = "hello";
let z: boolean = true;

// Function declaration
function add(a: number, b: number): number {
    return a + b;
}

// Function call
let result = add(x, 10);

// Conditional
if (x > 0) {
    return x * 2;
} else {
    return x / 2;
}
`;

console.log('Source code:');
console.log(sourceCode);
console.log('\nTokens:');

const lexer = new Lexer(sourceCode);
let token;

while ((token = lexer.getNextToken()).type !== 'EOF') {
    console.log(`Type: ${token.type}, Value: "${token.value}", Line: ${token.line}, Column: ${token.column}`);
} 