(() => {
  "use strict";

  const sequelize = require("sequelize");
  const connection = require("../database/database");
  const Category = require("../categories/Category");

  var Article = connection.define("articles", {
    title: {
      type: sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: sequelize.STRING,
      allowNull: false,
    },
    body: {
      type: sequelize.STRING,
      allowNull: false,
    },
  });

  Category.hasMany(Article);
  Article.belongsTo(Category);
  // Article.sync({ force: true });
  module.exports = Article;
})();
