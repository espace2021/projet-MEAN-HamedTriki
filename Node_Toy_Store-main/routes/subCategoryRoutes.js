const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

router.get("/", subCategoryController.getAllSubCategories);

router.post("/", subCategoryController.createSubCategory);

router.delete("/:id", subCategoryController.deleteSubCategory);

router.get(
  "/by-parent/:parentCategory",
  subCategoryController.getSubCategoriesByParentCategory
);

module.exports = router;
