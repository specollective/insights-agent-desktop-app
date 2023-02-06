module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        ["module-resolver", {
          "root": ["./src"],
        }]
      ]
    },
    development: {
      compact: true,
    }
  }
}
