const express = require('express');
const router = express.Router();
const poojaController = require('../controllers/poojaController');

router.get('/categories', poojaController.getCategories);
router.get('/pincodes', poojaController.getServiceablePincodes);
router.get('/poojas', poojaController.getAllPoojas);
router.get('/poojas/:id/details', poojaController.getPoojaDetails);
router.get('/purohits', poojaController.getPurohits);
router.get('/purohits/:id/reviews', poojaController.getPurohitReviews);
router.get('/addons', poojaController.getAddons);
router.get('/package-options', poojaController.getPackageOptions);

module.exports = router;
