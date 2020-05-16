(() => {
  "use strict";
  const express = require("express");
  const router = express.Router();
  const Category = require("../categories/Category");
  const Article = require("../articles/Articles");
  const slugfy = require("slugify");
  const adminAunth = require("../middewares/adminAuth")

  router.get("/admin/articles", adminAunth, (req, res) => {
    Article.findAll({
      include: [{
        model: Category
      }],
    }).then((articles) => {
      res.render("../views/admin/articles", {
        articles
      });
    });
  });

  router.get("/admin/articles/new", adminAunth, (req, res) => {
    Category.findAll().then((categories) => {
      res.render("../views/admin/articles/new.ejs", {
        categories
      });
    });
  });

  router.post("/articles/save", adminAunth, (req, res) => {
    Article.create({
      title: req.body.title,
      slug: slugfy(req.body.title),
      body: req.body.body,
      categoryId: req.body.category,
    }).then(() => {
      res.redirect("/admin/articles");
    });
  });

  router.post("/articles/delete", adminAunth, (req, res) => {
    var id = req.body.id;
    Article.destroy({
      where: {
        id: id
      },
    }).then(() => {
      res.redirect("/admin/articles");
    });
  });

  router.get("/admin/articles/edit/:id", adminAunth, (req, res) => {
    let id = req.params.id;
    Article.findByPk(id).then((article) => {
      Category.findAll({}).then((categories) => {
        res.render("../views/admin/articles/edit.ejs", {
          article,
          categories
        });
      });
    });
  });

  router.post("/articles/edit", adminAunth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    if (id == undefined || isNaN(id)) {
      res.redirect("/admin/articles");
    }
    Article.update({
      title: title,
      slug: slugfy(title),
      body: body,
      categoryId: category
    }, {
      where: {
        id: id
      }
    }).then(() => {
      res.redirect("/admin/articles");
    });
  });

  router.get("/articles/page/:num", (req, res) => {
    let page = req.params.num;
    var offset = 0;
    if (isNaN(page) || page == 1) {
      offset = 0;
    } else {
      offset = (parseInt(page) - 1) * 4;
    }
    Article.findAndCountAll({
      limit: 4,
      offset: offset,
      order: [
        ["id", "DESC"]
      ],
    }).then((articles) => {
      let next;
      if (offset + 4 >= articles.count) {
        next = false;
      } else {
        next = true;
      }
      var result = {
        page: parseInt(page),
        next,
        articles,
      };
      Category.findAll().then((categories) => {
        res.render("admin/articles/page.ejs", {
          result,
          categories
        });
      });
    });
  });

  module.exports = router;
})();