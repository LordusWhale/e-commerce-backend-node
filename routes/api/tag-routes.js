const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
function getTagByIdMiddleware(req, res, next) {
  const { id } = req.params;
  Tag.findByPk(id, {
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        res.status(404).json({ message: "No tag found with this id" });
        return;
      }
      req.tag = dbTagData;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

router.get("/", (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  })
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", getTagByIdMiddleware, (req, res) => {
  res.json(req.tag);
});

router.post("/", (req, res) => {
  Tag.create(req.body)
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", getTagByIdMiddleware, (req, res) => {
  req.tag
    .update(req.body)
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", getTagByIdMiddleware, (req, res) => {
  req.tag
    .destroy()
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
