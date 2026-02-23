CREATE TABLE message (
  message_id SERIAL PRIMARY KEY,
  message_subject VARCHAR(255) NOT NULL,
  message_body TEXT NOT NULL,
  message_from INTEGER NOT NULL REFERENCES account(account_id),
  message_to INTEGER NOT NULL REFERENCES account(account_id),
  message_read BOOLEAN DEFAULT FALSE,
  message_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);