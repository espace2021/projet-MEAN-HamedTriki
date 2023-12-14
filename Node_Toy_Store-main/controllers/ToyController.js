const Toy = require("../models/toy");

const getAllToys = async (req, res) => {
  try {
    const toys = await Toy.find();
    res.status(200).json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRandomToys = async (req, res) => {
  try {
    const toys = await Toy.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getToyById = async (req, res) => {
  const id = req.params.id;

  try {
    const toy = await Toy.findById(id);
    res.status(200).json(toy);
  } catch (error) {
    res.status(404).json({ message: "Toy not found" });
  }
};

const createToy = async (req, res) => {
  const toy = new Toy({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    prevPrice: req.body.prevPrice,
    stock: req.body.stock,
    category: req.body.category,
    subCategory: req.body.subCategory,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newToy = await toy.save();
    res.status(201).json(newToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateToy = async (req, res) => {
  const id = req.params.id;

  try {
    const toy = await Toy.findById(id);

    if (!toy) {
      throw new Error("Toy not found");
    }

    toy.name = req.body.name;
    toy.description = req.body.description;
    toy.price = req.body.price;
    toy.prevPrice = req.body.prevPrice;
    toy.stock = req.body.stock;
    toy.category = req.body.category;
    toy.subCategory = req.body.subCategory;
    toy.imageUrl = req.body.imageUrl;

    const updatedToy = await toy.save();

    res.status(200).json(updatedToy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteToy = async (req, res) => {
  const id = req.params.id;

  try {
    const toy = await Toy.findByIdAndDelete(id);

    if (!toy) {
      throw new Error("Toy not found");
    }

    res.status(200).json({ message: "Toy deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllToys,
  getToyById,
  createToy,
  updateToy,
  deleteToy,
  getRandomToys,
};
