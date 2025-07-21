const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const Company = require('../models/company');

// ✅ POST /recipes - Tạo công thức mới
router.post('/', async (req, res) => {
  const { recipeID, name, image, colorCodes, company } = req.body;

  try {
    // Kiểm tra xem company có tồn tại không
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const newRecipe = new Recipe({
      recipeID,
      name,
      image,
      colorCodes,
      company,
    });

    await newRecipe.save();
    res.status(201).json({ message: 'Recipe created', recipe: newRecipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET /recipes - Lấy tất cả công thức
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('company'); // Populate thông tin công ty
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /recipes/:id - Lấy công thức theo ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('company');
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT /recipes/:id - Cập nhật công thức
router.put('/:id', async (req, res) => {
  const { recipeID, name, image, colorCodes, company } = req.body;

  try {
    // Kiểm tra xem company có tồn tại không nếu cập nhật company
    if (company) {
      const companyExists = await Company.findById(company);
      if (!companyExists) {
        return res.status(404).json({ error: 'Company not found' });
      }
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { recipeID, name, image, colorCodes, company },
      { new: true, runValidators: true }
    ).populate('company');

    if (!updated) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe updated', recipe: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE /recipes/:id - Xoá công thức
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;