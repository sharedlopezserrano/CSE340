const express = require("express")
const router = new express.Router()

const utilities = require("../utilities/")
const messageController = require("../controllers/messageController")

router.get(
  "/inbox",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildInbox)
)

router.get(
  "/sent",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildSent)
)

router.get(
  "/compose",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildCompose)
)

router.post(
  "/send",
  utilities.checkLogin,
  utilities.handleErrors(messageController.sendMessage)
)

router.get(
  "/view/:message_id",
  utilities.checkLogin,
  utilities.handleErrors(messageController.viewMessage)
)

module.exports = router