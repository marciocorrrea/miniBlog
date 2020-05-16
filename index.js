(() => {
  // "use strict";

  const express = require("express");
  const app = new express();
  const ejs = require("ejs");
  const bodyParser = require("body-parser");
  const connection = require("./database/database");
  const session = require("express-session")

  // importando as outras rotas estabelecidas em categoriesController
  const categoriesController = require("./categories/categoriesControler");
  const articlesController = require("./articles/articlesController");
  const usersController = require("./user/userControler");

  const Article = require("./articles/Articles");
  const Category = require("./categories/Category");
  const User = require("./user/User");

  app.use(session({
    secret: "qualquercoisa",
    cookie: {
      maxAge: 300000
    }
  }))

  // USANDO BODY PARSER
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  // conectando no banco de dados
  connection
    .authenticate()
    .then(() => {})
    .catch(() => {});

  // definindo rotas importadas.
  app.use("/", categoriesController);
  app.use("/", articlesController);
  app.use("/", usersController);
  // usando EJS
  app.set("view engine", "ejs");




  // definindo pasta padrão para arquivos estaticos
  app.use(express.static("public"));

  app.get("/", (req, res) => {
    Article.findAll({
      order: [
        ["id", "DESC"]
      ],
      limit: 4,
    }).then((articles) => {
      Category.findAll().then((categories) => {
        res.render("index", {
          articles,
          categories
        });
      });
    });
  });

  app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
          slug: slug
        },
      })
      .then((article) => {
        if (article == undefined) {
          res.redirect("/");
        } else {
          Category.findAll().then((categories) => {
            res.render("article", {
              article,
              categories
            });
          });
        }
      })
      .catch((erro) => {
        res.redirect("/");
      });
  });

  app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
          slug: slug
        },
        include: [{
          model: Article
        }],
      })
      .then((category) => {
        if (category == undefined) {
          res.redirect("/");
        } else {
          Category.findAll().then((categories) => {
            res.render("index", {
              articles: category.articles,
              categories
            });
          });
        }
      })
      .catch((erro) => {
        res.redirect("/");
      });
  });

  app.listen("5050", (error) => {
    if (error) console.log("error:", error);
  });
})();