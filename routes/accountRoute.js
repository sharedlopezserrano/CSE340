const express = require("express")
const router = new express.Router()

const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccountView)
)

// Process account update (names + email)
router.post(
  "/update",
  utilities.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)
// Logout route
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router