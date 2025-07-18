const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/test', (req, res) => {
    res.json({
        message: 'User route is working',
        timestamp: new Date().toISOString(),
    });
});

router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

console.log('user route loaded');
module.exports = router;