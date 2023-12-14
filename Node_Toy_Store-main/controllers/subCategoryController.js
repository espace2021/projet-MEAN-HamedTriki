const SubCategory = require("../models/subCategory");

const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate("parentCategory");
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "Error getting subcategories" });
  }
};

const createSubCategory = async (req, res) => {
  const existingSubCategory = await SubCategory.findOne({
    name: req.body.name,
  });

  if (existingSubCategory) {
    return res
      .status(409)
      .json({ message: "Sub Category name already exists" });
  }

  const scategory = new SubCategory({
    name: req.body.name,
    parentCategory: req.body.parentCategory,
  });

  try {
    const Subcategory = await scategory.save();
    res.status(201).json(Subcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
      throw new Error("Subcategory not found");
    }

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSubCategoriesByParentCategory = async (req, res) => {
  const parentCategory = req.params.parentCategory;

  try {
    const subcategories = await SubCategory.find({
      parentCategory: parentCategory,
    });

    if (!subcategories) {
      throw new Error("Subcategories not found for the given parent category");
    }

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllSubCategories,
  createSubCategory,
  deleteSubCategory,
  getSubCategoriesByParentCategory,
};
