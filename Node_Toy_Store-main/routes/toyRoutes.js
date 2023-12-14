const express = require("express");
const router = express.Router();
const {
  getAllToys,
  getToyById,
  createToy,
  updateToy,
  deleteToy,
  getRandomToys,
} = require("../controllers/ToyController");

router.get("/", getAllToys);
router.get("/:id", getToyById);
router.get("/random/aleatory", getRandomToys);
router.post("/", createToy);
router.put("/:id", updateToy);
router.delete("/:id", deleteToy);

module.exports = router;
