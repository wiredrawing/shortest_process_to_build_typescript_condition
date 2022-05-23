


module.exports = {



  entry: "./src/index.ts",
  mode: "development",

  output: {
    filename: "main.js",
    path: __dirname + "/dist"
  },

  devServer: {
    static: __dirname + "/public",
    open: true,
  },


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
