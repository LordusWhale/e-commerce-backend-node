const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

function getCategoryByIdMiddleWare(req, res, next) {
  const { id } = req.params;
  Category.findByPk(id, {
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(404).json({ message: "No category found with this id" });
        return;
      }
      req.category = dbCategoryData;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

router.get("/", (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })

    .then((dbCategoryData) => res.json(dbCategoryData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", getCategoryByIdMiddleWare, (req, res) => {
  res.json(req.category);
});

router.post("/", (req, res) => {
  Category.create(req.body)
  .then((dbCategoryData) => res.json(dbCategoryData))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.put("/:id", getCategoryByIdMiddleWare, (req, res) => {
  req.category.update({
    category_name: req.body.category_name,
  })
  .then((dbCategoryData) => res.json(dbCategoryData))
});

router.delete("/:id", getCategoryByIdMiddleWare, (req, res) => {
  req.category.destroy()
  .then((dbCategoryData) => res.json(dbCategoryData))

});

module.exports = router;
