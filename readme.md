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