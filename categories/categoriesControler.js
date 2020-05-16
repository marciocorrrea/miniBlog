(() => {
  "use strict";
  const express = require("express");
  const router = express.Router();
  const Category = require("./Category");
  const slugify = require("slugify");
  const adminAunth = require("../middewares/adminAuth")

  router.get("/admin/categories/new", adminAunth, (req, res) => {
    res.render("../views/admin/categories/new.ejs");
  });

  router.post("/categories/save", adminAunth, (req, res) => {
    var title = req.body.title;
    if (title == undefined) {
      res.redirect("/admin/categories/new");
    } else {
      Category.create({
        title: title,
        slug: slugify(title),
      }).then(() => {
        res.redirect("/admin/categories");
      });
    }
  });

  router.get("/admin/categories", adminAunth, (req, res) => {
    Category.findAll({
      raw: true
    }).then((categories) => {
      res.render("../views/admin/categories", {
        categories
      });
    });
  });

  router.post("/categories/delete", adminAunth, (req, res) => {
    var id = req.body.id;
    if (id == undefined || isNaN(id)) {
      res.redirect("/admin/categories");
    } else {
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    }
  });

  router.get("/admin/categories/edit/:id", adminAunth, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("/admin/categories");
    }
    Category.findByPk(id)
      .then((category) => {
        if (category == undefined) {
          res.redirect("/admin/categories");
        } else {
          res.render("../views/admin/categories/edit.ejs", {
            category
          });
        }
      })
      .catch(() => {
        res.redirect("/admin/categories");
      });
  });

  router.post("/categories/update", adminAunth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    Category.update({
      title: title,
      slug: slugify(title)
    }, {
      where: {
        id,
        id
      }
    }).then(() => {
      res.redirect("/admin/categories");
    });
  });

  module.exports = router;
})();