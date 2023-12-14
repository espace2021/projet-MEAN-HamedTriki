const Category = require("../models/category");

const getAllCategories = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: "Category not found" });
  }
};

const createCategory = async (req, res) => {
  const existingCategory = await Category.findOne({ name: req.body.name });

  if (existingCategory) {
    return res.status(409).json({ message: "Category name already exists" });
  }

  const category = new Category({
    name: req.body.name,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    category.name = req.body.name;

    const updatedcategory = await category.save();

    res.status(200).json(updatedcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new Error("Category not found");
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
