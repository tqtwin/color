const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const Recipe = require('../models/recipe'); // Thêm để sử dụng Recipe

// ✅ POST /companies - Tạo công ty mới
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const newCompany = new Company({ name });
    await newCompany.save();
    res.status(201).json({ message: 'Company created', company: newCompany });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET /companies - Lấy danh sách tất cả công ty
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().populate('recipes');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /companies/:id - Lấy thông tin công ty theo MongoDB ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('recipes');
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT /companies/:id - Cập nhật công ty theo ID
router.put('/:id', async (req, res) => {
  const { name } = req.body;

  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    ).populate('recipes');
    if (!updated) return res.status(404).json({ error: 'Company not found' });
    res.json({ message: 'Company updated', company: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE /companies/:id - Xóa công ty theo ID
router.delete('/:id', async (req, res) => {
  try {
    const recipes = await Recipe.find({ company: req.params.id });
    if (recipes.length > 0) {
      return res.status(400).json({ error: 'Cannot delete company with associated recipes' });
    }
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;