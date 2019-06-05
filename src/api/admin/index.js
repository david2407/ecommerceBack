const express = require('express');
const AdminUserController = require('./AdminUserController');
const ProductController = require('./ProductController');
const CartController = require('./CartController');
const OrderController = require('./OrderController');
const CategoriesController = require('./CategoryController');

// const { uploadFile, uploadImage, uploadImages } = require('../../utils/fileUtils');
const router = express.Router();

// Users
router.get('/users', AdminUserController.getUsers);
router.get('/users/search', AdminUserController.searchEmail);
router.put('/user/change-password', AdminUserController.changeUserPassword);
router.put('/user/:user_id', AdminUserController.editUserInfo);
router.get('/users/:user_id/search', AdminUserController.getUserById);

// Product
router.get('/products', ProductController.getProducts);
router.get('/product/:productId', ProductController.getProductById);

// Cart
router.get('/carts', CartController.getCarts);
router.get('/cart/:cartId', CartController.getCartById);

// Order
router.get('/orders', OrderController.getOrders);
router.get('/order/:orderId', OrderController.getOrderById);
router.get('/order/:userId', OrderController.getOrderByUserId);
router.post('/order/create', OrderController.createOrder);

// Categories
router.get('/categories', CategoriesController.getCategories);

module.exports = router;
