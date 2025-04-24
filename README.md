# TypeScript Compiler


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

## Uso

Para ejecutar el test del lexer:

bash
```ts-node src/test-lexer.ts


