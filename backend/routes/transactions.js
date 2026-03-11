const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route   GET api/v1/transactions
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ 
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/v1/transactions
router.post('/', auth, async (req, res) => {
    const { type, amount, category, description, date } = req.body;
    try {
        const transaction = await Transaction.create({
            userId: req.user.id,
            type,
            amount,
            category,
            description,
            date
        });
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/v1/transactions/:id
router.put('/:id', auth, async (req, res) => {
    const { type, amount, category, description, date } = req.body;
    try {
        let transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
        if (transaction.userId !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await transaction.update({ type, amount, category, description, date });
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE api/v1/transactions/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        let transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
        if (transaction.userId !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await transaction.destroy();
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
