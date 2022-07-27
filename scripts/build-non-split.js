const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js"); // If you ejected use this instead use const default = rewire('./build.js')
let config = defaults.__get__("config");

config.optimization.splitChunks = {
  cacheGroups: {
    defaults: false,
  },
};

config.optimization.runtimeChunk = false;
