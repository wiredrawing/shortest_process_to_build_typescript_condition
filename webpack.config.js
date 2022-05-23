


module.exports = {

  // 実際にwebpackでバンドルしたい且つトランスパイルしたいjavascriptの
  // エントリポイント(エントリファイルのパスをここに記載)
  // src/index.js がデフォルト設定となる
  entry: __dirname + "/src/index.ts",

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
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        }
      }
    ]
  },
  resolve: {
    extensions: [
      ".ts", ".js",
    ]
  }
}
