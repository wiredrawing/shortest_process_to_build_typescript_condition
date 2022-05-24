# Webpackコマンドでバンドルする際と同時にtypescriptで記述した内容をES5の構文にトランスパイルする




## 1.まず通常のES6以上で記述されたJSをES5にトランスパイルしバンドルできる環境を作る

```console.ini

# まず node.jsのプロジェクトを作成
# プロジェクトの初期化を行う
npm init -y 

```

上記コマンド実行後,以下のようなjsonファイルが作成されること確認する

```package.json

{
  "name": "shortest_process_to_build_typescript_condition",                               
  "version": "1.0.0",                                                                     
  "description": "",                                                                      
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/wiredrawing/shortest_process_to_build_typescript_condition.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/wiredrawing/shortest_process_to_build_typescript_condition/issues"
  },
  "homepage": "https://github.com/wiredrawing/shortest_process_to_build_typescript_condition#readme"
}

```

## 2.次にWebpackコマンドが実行できる環境を構築する

```console.ini

npm install --save-dev webpack webpack-cli webpack-dev-server

```

上記 Webpack関連のモジュールのインストールが完了したら以下コマンドを実行する

```console.ini

npx webpack --mode development

# 上記コマンドを設定すると 必要なディレクトリとファイルが存在しないので
# 以下のようなエラーが出力される

Module not found: Error: Can't resolve './src' in 'C:\Users\your-name\works\shortest_process_to_build_typescript_condition'

```

上記のエラー内容の通り実際にトランスパイルされるjavascriptファイルが
カレントディレクト直下のsrcディレクトリを対象とするため
以下のようにしてsrcディレクトリ および src/index.js とファイルを作成する

```console.ini

mkdir src

touch src/index.js

```

上記で  src/index.jsファイルを作成して試しに以下のようなjavascriptを作成する

```index.js

class TestClass {
  
  
  constructor() {
    
    console.log("constructor");
  }
}

```

上記を記述した上で再度 webpackコマンドを実行すると

以下のような内容でバンドルされる

```dist/main.js

/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("\n\nclass TestClass {\n\n\n  constructor() {\n    console.log(\"constructor\");\n  }\n}\n\n//# sourceURL=webpack://shortest_process_to_build_typescript_condition/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;

```

正しくバンドルできているようだが
ES6 => ES5 へのトランスパイルができていない.



## 3.webpackコマンド実行時にES6 => ES5 へのトランスパイルを実現させる

```console.ini

# トランスパイルに必要なモジュールをインストールする

npm install --save-dev @babel/core @babeel/preset-env babel-loader

```

上記babel関連のインストールが完了したらwebpackコマンド実行時に
トランスパイルするように設定ファイルを修正する

```console.ini
# まずカレントディレクトリに 以下のファイルを作成する

touch webpack.config.json

```

作成したwebpack.config.jsonを以下のように修正する

```webpack.config.js

module.exports = {

  // 実際にwebpackでバンドルしたい且つトランスパイルしたいjavascriptの
  // エントリポイント(エントリファイルのパスをここに記載)
  // src/index.js がデフォルト設定となる
  entry: __dirname + "/src/index.js",

  // webpackコマンド実行時のモード
  mode: "development",

  // バンドルおよびトランスパイルされたjavascriptの出力先
  // デフォルトではdist/main.jsとなる
  output: {
    filename: "main.js",
    path: __dirname + "/dist"
  },

  // webpack-dev-serverを実行したときの
  // バンドルされたmain.jsを利用する静的ファイルのドキュメントルートを指定
  devServer: {
    static: __dirname + "/public",
    open: true,
  },

  // デフォルトだとトランスパイル結果がevalで実行されるため
  // トランスパイル結果を確認しやすいように修正
  devtool: 'inline-cheap-module-source-map',

  // これを記述しないとアロー関数がES5にトランスパイルされない
  target: [
    "es5",
    "web",
  ],

  // ここから下が babelトランスパイラを使った設定プロパティ
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env"
            ]
          }
        }
      },
    ]
  },
}

```
では,この状態で先程の src/index.jsファイルをバンドルおよびトランスパイルしてみる

```console.ini

npx webpack --mode development

# 上記コマンド実行後 dist/main.jsが生成される

```

```dist/main.js

/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestClass = /*#__PURE__*/_createClass(function TestClass() {
  _classCallCheck(this, TestClass);

  console.log("constructor");
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJza....

```

ES6以上で記述したclass構文などがES5形式で記述されなおされているのが確認できる



## 4.typescriptで記述してES5へトランスパイルさせる

```console.ini

# typescriptをトランスパイルさせるために必要なモジュールをインストールする

npm install --save-dev ts-loader typescript

```

## 5.typescriptのトランスパイルをするためにwebpack.config.jsを再度編集

```webpack.config.js

// すでにある内容に一部修正と追加設定を行う

module.exports = {

  // エントリポイントをtypescriptとするため以下のように
  // 拡張子を .js => .ts に変更
  entry: __dirname + "/src/index.ts",

  // ..............


  // 既存のES6 => ES5のトランスパイル設定を残したまま
  // typescriptのトランスパイル設定を追加する
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env"
            ]
          }
        }
      },
      // 以下を追加
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        }
      }
    ]
  },
  // エントリポイントを認識するように
  // 以下を追加
  resolve: {
    extensions: [
      ".ts", ".js",
    ]
  }
}

```

トランスパイル対象のtypescriptを以下のように作成する
```src/index.ts

let functionHavingTypeParameter = (a: string , b: number) : boolean => {


    console.log(a);
    console.log(b);

    return true;
}

let result = functionHavingTypeParameter("あ", 42);


class TypescriptClass {

    a: string;
    b: number;

    constructor(a: string, b: number) {
        this.a = a;
        this.b = b;
    }
}

let typescriptObject = new TypescriptClass("a",2, );

```

上記の用に webpack.config.jsを変更後且つsrc/index.tsファイルを作成後再度
webpackコマンドを実行する

```dist/main.js

/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
var functionHavingTypeParameter = function (a, b) {
    console.log(a);
    console.log(b);
    return true;
};
var result = functionHavingTypeParameter("あ", 42);
var TypescriptClass = /** @class */ (function () {
    function TypescriptClass(a, b) {
        this.a = a;
        this.b = b;
    }
    return TypescriptClass;
}());
var typescriptObject = new TypescriptClass("a", 2);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW....

```

型パラメータ付きのアロー関数およびクラスもES5形式にトランスパイルされている

## 6.typescriptでjqueryを使用する

typescriptでもjqueryによるDOM操作を行いたい場合は以下のように
jquery関連モジュールをインストールする


```console.ini

npm install --save-dev jquery @types/jquery

```


## 7.index.tsファイルに jqueryをimport する


```src/index.ts

// このようにjqueryから $ をインポート
import $ from "jquery"

let functionHavingTypeParameter = (a: string , b: number) : boolean => {


    console.log(a);
    console.log(b);

    return true;
}

let result = functionHavingTypeParameter("あ", 42);


class TypescriptClass {

    a: string;
    b: number;

    constructor(a: string, b: number) {
        this.a = a;
        this.b = b;
    }
}

let typescriptObject = new TypescriptClass("a",2, );
```

まずはこの状態で webpack コマンドを実行すると

```console.ini

ERROR in ./src/index.ts
[tsl] ERROR
      TS18002: The 'files' list in config file 'tsconfig.json' is empty.
ts-loader-default_e3b0c44298fc1c14

```
上記のようなtypescriptをトランスパイルするための
設定ファイルがないと言われるので 対象の tsconfig.jsonというファイルを作成する

※ tsconfig.jsonを作成するためのコマンドが tscコマンドによって提供されている
※ 追記1)を参照

```tsconfig.json

// 一旦なかみは空っぽ
{
}

```

この上で再度 webpackコマンドを実行すると

```console.ini

ERROR in C:\Users\your-name\works\shortest_process_to_build_typescript_condition\src\index.ts
./src/index.ts 1:7-8
[tsl] ERROR in C:\Users\your-name\works\shortest_process_to_build_typescript_condition\src\index.ts(1,8)
      TS1259: Module '"C:\\Users\\your-name\\works\\shortest_process_to_build_typescript_condition\\node_modules\\@types\\jquery\\index"' can only be default-imported using the 'esModuleInterop' flag
ts-loader-default_e3b0c44298fc1c14

```

上記の用なエラーが出力される...

ずばり

```tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
  },

}
```
上記のように 設定するとトランスパイルが通る
では実際に typescript上でjqueryを使ってDOM操作を行う


```public/index.html

<html>

<script src="/main.js"></script>
<body>


<div id="sample"></div>
</body>


</html>

```

HTMLファイルを上記のように修正して id="sample"のdivタグの中身のテキストを
typescriptで操作する


```src/index.ts
// トランスパイル前のtypescriptは以下のように修正する

import $ from "jquery"

let functionHavingTypeParameter = (a: string , b: number) : boolean => {
    
    console.log(a);
    console.log(b);

    return true;
}

let result = functionHavingTypeParameter("あ", 42);

class TypescriptClass {

    a: string;
    b: number;

    constructor(a: string, b: number) {
        this.a = a;
        this.b = b;
    }
}

let typescriptObject = new TypescriptClass("a",2, );

$(function () {

    let elem: JQuery = $("#sample");
    elem.html("これはTypescriptで操作しています");
});
```

webpack-dev-serverを起動させる

```console.log

# webpack開発用サーバーを起動

npx webpack serve --mode development

```

起動した
http://localhost:8080サーバー上で
"これはTypescriptで操作しています" というテキストが画面上に表示されていれば成功
Typescriptでjqueryを使ったDOM操作まで行う環境が構築できた.




## 追記1) tsc コマンドで tsconfig.jsonファイルを作成する

```console.ini

# tscコマンドが tsconfig.json を作成するためのコマンドオプションを提供している

npx tsc --init

#上記コマンド実行後

PS C:\Users\your-name\works\shortest_process_to_build_typescript_condition> npx tsc --init

Created a new tsconfig.json with:                                                                                       
                                                                                                                     TS 
  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true


You can learn more at https://aka.ms/tsconfig.json

```
上記出力が表示されればOK.
カレントディレクトリ上に tsconfig.jsonというファイルが作成されている

```tsconfig.json

{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Enable incremental compilation */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./",                          /* Specify the folder for .tsbuildinfo incremental compilation files. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h' */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.` */
    // "reactNamespace": "",                             /* Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */

    /* Modules */
    "module": "commonjs",                                /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like `./node_modules/@types`. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "resolveJsonModule": true,                        /* Enable importing .json files */
    // "noResolve": true,                                /* Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with `allowJs`. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have `@internal` in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like `__extends` in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing `const enum` declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    "strict": true,                                      /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied `any` type.. */
    // "strictNullChecks": true,                         /* When type checking, take into account `null` and `undefined`. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}


```

