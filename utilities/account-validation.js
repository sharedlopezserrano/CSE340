const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        if (typeof accountModel.checkExistingEmail === "function") {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists) {
            throw new Error("Email exists. Please log in or use different email")
          }
        } else {
          const existing = await accountModel.getAccountByEmail(account_email)
          if (existing) {
            throw new Error("Email exists. Please log in or use different email")
          }
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Login Data Validation Rules
 * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
  }
  next()
}

/* ******************************
 * Update Account Validation Rules
 * ***************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),

    body("account_id")
      .trim()
      .notEmpty()
      .withMessage("Missing account id."),
  ]
}

/* ******************************
 * Check update account data
 * - Ensure email is unique IF changed
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const errors = validationResult(req)

  const currentAccount = await accountModel.getAccountById(account_id)

  // if the email changed, ensure it's not used by someone else
  if (currentAccount && currentAccount.account_email !== account_email) {
    const emailExists = await accountModel.getAccountByEmail(account_email)
    if (emailExists) {
      errors.errors.push({
        value: account_email,
        msg: "Email already exists. Please use a different email.",
        param: "account_email",
        location: "body",
      })
    }
  }

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
  next()
}

/* ******************************
 * Update Password Validation Rules
 * ***************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),

    body("account_id")
      .trim()
      .notEmpty()
      .withMessage("Missing account id."),
  ]
}

/* ******************************
 * Check update password data
 * ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_firstname: accountData?.account_firstname,
      account_lastname: accountData?.account_lastname,
      account_email: accountData?.account_email,
      account_id,
    })
  }
  next()
}

module.exports = validate
