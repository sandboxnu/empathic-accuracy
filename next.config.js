const withCSS = require("@zeit/next-css");
const path = require("path");

module.exports = withCSS({
  cssLoaderOptions: {
    url: false,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });
    // Here is the magic
    // We push our config into the resolve.modules array
    config.resolve.modules.push(path.resolve("./src"));
    return config;
  },
});
