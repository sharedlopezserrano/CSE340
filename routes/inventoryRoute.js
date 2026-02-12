// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view (PROTECTED)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildManagement)
)

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

// Deliver add classification view (PROTECTED)
router.get(
  "/classification/add",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification (PROTECTED)
router.post(
  "/classification/add",
  utilities.checkLogin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Deliver add inventory view (PROTECTED)
router.get(
  "/inventory/add",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory (PROTECTED)
router.post(
  "/inventory/add",
  utilities.checkLogin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update",
  utilities.checkLogin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Return inventory items as JSON by classification (PROTECTED)
router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit inventory view
router.get(
  "/edit/:invId",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildEditInventoryView)
)

// Route to build delete confirmation view
router.get(
  "/delete/:invId",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Process inventory delete
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
