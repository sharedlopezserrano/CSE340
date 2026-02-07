// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId)
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))


// Deliver add classification view
router.get(
  "/classification/add",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process add classification
router.post(
  "/classification/add",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Deliver add inventory view
router.get(
  "/inventory/add",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process add inventory
router.post(
  "/inventory/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;