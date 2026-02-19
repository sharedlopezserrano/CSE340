const utilities = require("../utilities/")
const messageModel = require("../models/message-model")

const messageController = {}

// inbox
messageController.buildInbox = async (req, res) => {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const inbox = await messageModel.getInbox(account_id)

  res.render("message/inbox", {
    title: "Inbox",
    nav,
    errors: null,
    inbox,
  })
}

messageController.buildSent = async (req, res) => {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const sent = await messageModel.getSent(account_id)

  res.render("message/sent", {
    title: "Sent Messages",
    nav,
    errors: null,
    sent,
  })
}

messageController.buildCompose = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("message/compose", {
    title: "Compose Message",
    nav,
    errors: null,
  })
}

messageController.sendMessage = async (req, res) => {
  const { message_subject, message_body, message_to } = req.body
  const message_from = res.locals.accountData.account_id

  const result = await messageModel.sendMessage(
    message_subject,
    message_body,
    message_from,
    parseInt(message_to)
  )

  if (result) {
    req.flash("notice", "Message sent.")
    return res.redirect("/message/sent")
  } else {
    req.flash("notice", "Sorry, the message could not be sent.")
    const nav = await utilities.getNav()
    return res.status(500).render("message/compose", {
      title: "Compose Message",
      nav,
      errors: null,
      message_subject,
      message_body,
      message_to,
    })
  }
}

messageController.viewMessage = async (req, res, next) => {
  const nav = await utilities.getNav()
  const message_id = parseInt(req.params.message_id)
  const msg = await messageModel.getMessageById(message_id)

  if (!msg) return next(new Error("Message not found"))

  const viewerId = res.locals.accountData.account_id

  if (msg.message_to !== viewerId && msg.message_from !== viewerId) {
    req.flash("notice", "You do not have permission to view that message.")
    return res.redirect("/message/inbox")
  }

  if (msg.message_to === viewerId && !msg.message_read) {
    await messageModel.markAsRead(message_id)
    msg.message_read = true
  }

  res.render("message/view", {
    title: msg.message_subject,
    nav,
    errors: null,
    msg,
  })
}

module.exports = messageController