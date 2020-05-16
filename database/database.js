(() => {
  "use strict";
  const Sequilize = require("sequelize");
  const connection = new Sequilize("blog", "root", "1895", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-3:00",
  });
  module.exports = connection;
})();
