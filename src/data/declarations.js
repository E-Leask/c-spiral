/**
 * Curated Database of C Declarations for C-Spiral
 * Each puzzle includes granular tokenized spiral steps, target English translations,
 * elemental distractor tiles, and educational explanations based on David Anderson's Clockwise/Spiral Rule.
 */

export const DECLARATIONS = [
  {
    id: 1,
    code: "char *str[10];",
    identifier: "str",
    difficulty: "easy",
    title: "Array of Pointers",
    targetSentence: [
      "str is",
      "array 10",
      "of",
      "pointers",
      "to",
      "char"
    ],
    distractors: [
      "pointer",
      "function",
      "returning",
      "const",
      "int"
    ],
    spiralSequence: [
      { token: "str", range: [6, 9], type: "identifier", phrase: "str is" },
      { token: "[10]", range: [9, 13], type: "array", phrase: "array 10 of" },
      { token: "*", range: [5, 6], type: "pointer", phrase: "pointers to" },
      { token: "char", range: [0, 4], type: "basetype", phrase: "char" }
    ],
    explanation: "Start at identifier `str`. Moving right, we see `[10]` (array 10 of). Turn left past `str` to see `*` (pointers to). Finally reach `char`."
  },
  {
    id: 2,
    code: "int *foo;",
    identifier: "foo",
    difficulty: "easy",
    title: "Simple Pointer",
    targetSentence: [
      "foo is",
      "pointer",
      "to",
      "int"
    ],
    distractors: [
      "array 5",
      "of",
      "function",
      "returning",
      "unsigned"
    ],
    spiralSequence: [
      { token: "foo", range: [5, 8], type: "identifier", phrase: "foo is" },
      { token: "*", range: [4, 5], type: "pointer", phrase: "pointer to" },
      { token: "int", range: [0, 3], type: "basetype", phrase: "int" }
    ],
    explanation: "Start at `foo`. Move right to `;` (end of statement), turn left to hit `*` (pointer to), then reach `int`."
  },
  {
    id: 3,
    code: "double (*bar)[5];",
    identifier: "bar",
    difficulty: "medium",
    title: "Pointer to Array",
    targetSentence: [
      "bar is",
      "pointer",
      "to",
      "array 5",
      "of",
      "double"
    ],
    distractors: [
      "functions",
      "returning",
      "pointers",
      "float",
      "const"
    ],
    spiralSequence: [
      { token: "bar", range: [9, 12], type: "identifier", phrase: "bar is" },
      { token: "*", range: [8, 9], type: "pointer", phrase: "pointer to" },
      { token: "[5]", range: [13, 16], type: "array", phrase: "array 5 of" },
      { token: "double", range: [0, 6], type: "basetype", phrase: "double" }
    ],
    explanation: "Start at `bar`. `bar` is inside parens `(*bar)`. Move left to see `*` (pointer to). Step outside parens and move right to see `[5]` (array 5 of). Turn left to reach `double`."
  },
  {
    id: 4,
    code: "char *(*fp)(int, float *);",
    identifier: "fp",
    difficulty: "medium",
    title: "Pointer to Function",
    targetSentence: [
      "fp is",
      "pointer",
      "to",
      "function (int, float *)",
      "returning",
      "pointer",
      "to",
      "char"
    ],
    distractors: [
      "array 10",
      "of",
      "void",
      "const",
      "double"
    ],
    spiralSequence: [
      { token: "fp", range: [8, 10], type: "identifier", phrase: "fp is" },
      { token: "*", range: [7, 8], type: "pointer", phrase: "pointer to" },
      { token: "(int, float *)", range: [11, 25], type: "function", phrase: "function (int, float *) returning" },
      { token: "*", range: [5, 6], type: "pointer", phrase: "pointer to" },
      { token: "char", range: [0, 4], type: "basetype", phrase: "char" }
    ],
    explanation: "Start at `fp` inside `(*fp)`. Turn left to `*` (pointer to). Step outside parens right to `(int, float *)` (function returning). Turn left to `*` (pointer to) then `char`."
  },
  {
    id: 5,
    code: "const char * const chptr;",
    identifier: "chptr",
    difficulty: "medium",
    title: "Const Pointer to Const Char",
    targetSentence: [
      "chptr is",
      "constant",
      "pointer",
      "to",
      "const",
      "char"
    ],
    distractors: [
      "array 5",
      "of",
      "volatile",
      "int",
      "function"
    ],
    spiralSequence: [
      { token: "chptr", range: [19, 24], type: "identifier", phrase: "chptr is" },
      { token: "const *", range: [11, 18], type: "const_pointer", phrase: "constant pointer to" },
      { token: "const char", range: [0, 10], type: "basetype", phrase: "const char" }
    ],
    explanation: "Start at `chptr`. Turn left to see `const *` (constant pointer to). Continue left to see `const char`."
  },
  {
    id: 6,
    code: "int (*(*arr[10])())[5];",
    identifier: "arr",
    difficulty: "hard",
    title: "Array of Function Pointers Returning Array Pointers",
    targetSentence: [
      "arr is",
      "array 10",
      "of",
      "pointers",
      "to",
      "functions",
      "returning",
      "pointer",
      "to",
      "array 5",
      "of",
      "int"
    ],
    distractors: [
      "(int)",
      "void",
      "float",
      "constant"
    ],
    spiralSequence: [
      { token: "arr", range: [8, 11], type: "identifier", phrase: "arr is" },
      { token: "[10]", range: [11, 15], type: "array", phrase: "array 10 of" },
      { token: "*", range: [7, 8], type: "pointer", phrase: "pointers to" },
      { token: "()", range: [16, 18], type: "function", phrase: "functions returning" },
      { token: "*", range: [5, 6], type: "pointer", phrase: "pointer to" },
      { token: "[5]", range: [19, 22], type: "array", phrase: "array 5 of" },
      { token: "int", range: [0, 3], type: "basetype", phrase: "int" }
    ],
    explanation: "Start at `arr` inside parens `(*arr[10])`. Move right to `[10]` (array 10 of). Turn left to `*` (pointers to). Step outside parens right to `()` (functions returning). Turn left to `*` (pointer to). Step outside parens right to `[5]` (array 5 of), turn left to `int`."
  },
  {
    id: 7,
    code: "void (*signal(int, void (*fp)(int)))(int);",
    identifier: "signal",
    difficulty: "guru",
    title: "The Ultimate C Signal Handler",
    targetSentence: [
      "signal is",
      "function (int, void (*fp)(int))",
      "returning",
      "pointer",
      "to",
      "function (int)",
      "returning",
      "void"
    ],
    distractors: [
      "array 10",
      "of",
      "char",
      "float",
      "constant"
    ],
    spiralSequence: [
      { token: "signal", range: [6, 12], type: "identifier", phrase: "signal is" },
      { token: "(int, void (*fp)(int))", range: [12, 35], type: "function", phrase: "function (int, void (*fp)(int)) returning" },
      { token: "*", range: [5, 6], type: "pointer", phrase: "pointer to" },
      { token: "(int)", range: [36, 41], type: "function", phrase: "function (int) returning" },
      { token: "void", range: [0, 4], type: "basetype", phrase: "void" }
    ],
    explanation: "Start at `signal`. It is inside parens `(*signal(...))`. Right side gives argument list `(int, void (*fp)(int))`. Turn left inside parens to `*` (pointer to). Step out right to `(int)` (function returning). Turn left to `void`."
  },
  {
    id: 8,
    code: "float *(*(*matrix)[3])[4];",
    identifier: "matrix",
    difficulty: "hard",
    title: "Nested Pointer to Matrix",
    targetSentence: [
      "matrix is",
      "pointer",
      "to",
      "array 3",
      "of",
      "pointers",
      "to",
      "array 4",
      "of",
      "pointer",
      "to",
      "float"
    ],
    distractors: [
      "functions",
      "returning",
      "double",
      "int"
    ],
    spiralSequence: [
      { token: "matrix", range: [10, 16], type: "identifier", phrase: "matrix is" },
      { token: "*", range: [9, 10], type: "pointer", phrase: "pointer to" },
      { token: "[3]", range: [17, 20], type: "array", phrase: "array 3 of" },
      { token: "*", range: [7, 8], type: "pointer", phrase: "pointers to" },
      { token: "[4]", range: [21, 24], type: "array", phrase: "array 4 of" },
      { token: "*", range: [6, 7], type: "pointer", phrase: "pointer to" },
      { token: "float", range: [0, 5], type: "basetype", phrase: "float" }
    ],
    explanation: "Start at `matrix`. Turn left to `*` (pointer to). Step out right to `[3]` (array 3 of). Turn left to `*` (pointers to). Step out right to `[4]` (array 4 of). Turn left to `*` (pointer to) and finally `float`."
  },
  {
    id: 9,
    code: "int (*handler[3])(char *);",
    identifier: "handler",
    difficulty: "medium",
    title: "Array of Event Handler Functions",
    targetSentence: [
      "handler is",
      "array 3",
      "of",
      "pointers",
      "to",
      "functions (char *)",
      "returning",
      "int"
    ],
    distractors: [
      "pointer to",
      "void",
      "float",
      "double"
    ],
    spiralSequence: [
      { token: "handler", range: [6, 13], type: "identifier", phrase: "handler is" },
      { token: "[3]", range: [13, 16], type: "array", phrase: "array 3 of" },
      { token: "*", range: [5, 6], type: "pointer", phrase: "pointers to" },
      { token: "(char *)", range: [17, 25], type: "function", phrase: "functions (char *) returning" },
      { token: "int", range: [0, 3], type: "basetype", phrase: "int" }
    ],
    explanation: "Start at `handler` inside parens. Move right to `[3]` (array 3 of). Turn left to `*` (pointers to). Step outside parens right to `(char *)` (functions returning). Turn left to `int`."
  },
  {
    id: 10,
    code: "volatile int * const *tbl;",
    identifier: "tbl",
    difficulty: "medium",
    title: "Pointer to Const Pointer to Volatile Int",
    targetSentence: [
      "tbl is",
      "pointer",
      "to",
      "constant",
      "pointer",
      "to",
      "volatile",
      "int"
    ],
    distractors: [
      "array 5",
      "of",
      "functions",
      "returning"
    ],
    spiralSequence: [
      { token: "tbl", range: [22, 25], type: "identifier", phrase: "tbl is" },
      { token: "*", range: [21, 22], type: "pointer", phrase: "pointer to" },
      { token: "const *", range: [15, 21], type: "const_pointer", phrase: "constant pointer to" },
      { token: "volatile int", range: [0, 12], type: "basetype", phrase: "volatile int" }
    ],
    explanation: "Start at `tbl`. Move right to `;`, turn left to hit `*` (pointer to). Continue left to `const *` (constant pointer to). Continue left to `volatile int`."
  }
];
