# TypeScript Compiler

Un compilador de TypeScript implementado en TypeScript, comenzando con el análisis léxico (lexer).

## Estructura del Proyecto

```
src/
├── lexer/
│   ├── lexer.ts    # Implementación del analizador léxico
│   └── token.ts    # Definición de tokens y tipos
└── test-lexer.ts   # Código de prueba
```

## Características

- Análisis léxico completo de código TypeScript
- Soporte para:
  - Palabras clave (let, const, function, etc.)
  - Tipos (number, string, boolean)
  - Operadores aritméticos y de comparación
  - Delimitadores (paréntesis, llaves, punto y coma)
  - Comentarios de una línea
  - Strings con escape de caracteres
  - Números enteros y decimales
  - Identificadores
  - Control de línea y columna para mensajes de error

## Requisitos

- Node.js
- TypeScript
- ts-node (para ejecutar los tests)

## Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install
```

## Uso

Para ejecutar el test del lexer:

```bash
npm run test
# o
ts-node src/test-lexer.ts
```

## Ejemplo de Salida

```typescript
// Código de entrada
let x = 42;
const y = "hello";

// Tokens generados
Type: LET, Value: "let", Line: 1, Column: 1
Type: IDENTIFIER, Value: "x", Line: 1, Column: 5
Type: ASSIGN, Value: "=", Line: 1, Column: 7
Type: NUMBER, Value: "42", Line: 1, Column: 9
Type: SEMICOLON, Value: ";", Line: 1, Column: 11
// ... etc
```

## Próximos Pasos

- [ ] Implementar el parser
- [ ] Añadir análisis semántico
- [ ] Implementar generación de código
- [ ] Añadir optimizaciones

## Licencia

MIT 