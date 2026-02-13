const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
)

router.get(
  "/classification/add",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/classification/add",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/inventory/add",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/inventory/add",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:invId",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventoryView)
)

router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:invId",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryItem)
)

router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
