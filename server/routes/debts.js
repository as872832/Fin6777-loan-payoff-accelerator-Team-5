const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.debts.push(req.body);
    await user.save();
    res.json(user.debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const debt = user.debts.id(req.params.id);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    Object.assign(debt, req.body);
    await user.save();
    res.json(user.debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.debts.pull({ _id: req.params.id });
    await user.save();
    res.json(user.debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;