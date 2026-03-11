const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// @route   GET api/v1/categories
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.findAll({ where: { userId: req.user.id } });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/v1/categories
router.post('/', auth, async (req, res) => {
    const { name, type } = req.body;
    try {
        const category = await Category.create({
            userId: req.user.id,
            name,
            type
        });
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE api/v1/categories/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        let category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        if (category.userId !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await category.destroy();
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
