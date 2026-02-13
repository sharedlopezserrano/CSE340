const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * ************************************ */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver register view
 * ************************************ */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * ************************************ */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult && regResult.rowCount) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    }

    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000,
    }

    if (process.env.NODE_ENV !== "development") {
      cookieOptions.secure = true
    }

    res.cookie("jwt", accessToken, cookieOptions)
    return res.redirect("/account/")
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Login failed. Please try again.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account update view
 * ************************************ */
async function buildUpdateAccountView(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)

  if (!res.locals.accountData || res.locals.accountData.account_id !== account_id) {
  req.flash("notice", "Unauthorized.")
  return res.redirect("/account/")
}

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}

/* ****************************************
 *  Process account update (names + email)
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")

    // refresh data for management view + refresh JWT cookie
    const freshAccount = await accountModel.getAccountById(account_id)
    if (freshAccount) {
      delete freshAccount.account_password
      const accessToken = jwt.sign(freshAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

      const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 }
      if (process.env.NODE_ENV !== "development") cookieOptions.secure = true
      res.cookie("jwt", accessToken, cookieOptions)

      res.locals.accountData = freshAccount
      res.locals.loggedin = 1
    }

    return res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
}

/* ****************************************
 *  Process password change
 * ************************************ */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")

      // refresh data for management view + refresh JWT cookie
      const freshAccount = await accountModel.getAccountById(account_id)
      if (freshAccount) {
        delete freshAccount.account_password
        const accessToken = jwt.sign(freshAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

        const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 }
        if (process.env.NODE_ENV !== "development") cookieOptions.secure = true
        res.cookie("jwt", accessToken, cookieOptions)

        res.locals.accountData = freshAccount
        res.locals.loggedin = 1
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the password update failed.")
      const accountData = await accountModel.getAccountById(account_id)
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname: accountData?.account_firstname,
        account_lastname: accountData?.account_lastname,
        account_email: accountData?.account_email,
        account_id,
      })
    }
  } catch (err) {
    req.flash("notice", "Sorry, something went wrong updating the password.")
    return res.redirect(`/account/update/${account_id}`)
  }
}
/* ****************************************
 *  Account Logout
 * ************************************ */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin, 
  buildUpdateAccountView,
  buildAccountManagement,
  updateAccount,
  updatePassword,
  accountLogout,
}