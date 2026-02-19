const pool = require("../database/")

async function sendMessage(message_subject, message_body, message_from, message_to) {
  try {
    const sql = `
      INSERT INTO message (message_subject, message_body, message_from, message_to)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const data = await pool.query(sql, [
      message_subject,
      message_body,
      message_from,
      message_to,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("sendMessage model error:", error)
    return null
  }
}

async function getInbox(account_id) {
  try {
    const sql = `
      SELECT m.message_id, m.message_subject, m.message_created, m.message_read,
             a.account_firstname, a.account_lastname
      FROM message m
      JOIN account a ON m.message_from = a.account_id
      WHERE m.message_to = $1
      ORDER BY m.message_created DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getInbox model error:", error)
    return []
  }
}

async function getSent(account_id) {
  try {
    const sql = `
      SELECT m.message_id, m.message_subject, m.message_created, m.message_read,
             a.account_firstname, a.account_lastname
      FROM message m
      JOIN account a ON m.message_to = a.account_id
      WHERE m.message_from = $1
      ORDER BY m.message_created DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getSent model error:", error)
    return []
  }
}

async function getMessageById(message_id) {
  try {
    const sql = `
      SELECT m.*, 
             af.account_firstname AS from_firstname, af.account_lastname AS from_lastname,
             at.account_firstname AS to_firstname, at.account_lastname AS to_lastname
      FROM message m
      JOIN account af ON m.message_from = af.account_id
      JOIN account at ON m.message_to = at.account_id
      WHERE m.message_id = $1
    `
    const data = await pool.query(sql, [message_id])
    return data.rows[0]
  } catch (error) {
    console.error("getMessageById model error:", error)
    return null
  }
}

async function markAsRead(message_id) {
  try {
    const sql = `
      UPDATE message
      SET message_read = TRUE
      WHERE message_id = $1
      RETURNING message_id
    `
    const data = await pool.query(sql, [message_id])
    return data.rowCount
  } catch (error) {
    console.error("markAsRead model error:", error)
    return 0
  }
}

module.exports = {
  sendMessage,
  getInbox,
  getSent,
  getMessageById,
  markAsRead,
}