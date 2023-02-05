const rules = require("./webpack.rules");
const path = require("path");

rules.push({
  test: /\.css$/,
  use: [                    
    "style-loader",
    "css-loader",
    "postcss-loader"
  ]
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      components: path.resolve(__dirname, "./src/renderer/components"),
      services: path.resolve(__dirname, "./src/services"),
      constants: path.resolve(__dirname, "./src/constants"),
    },
  },
  devtool: "nosources-source-map",
};
