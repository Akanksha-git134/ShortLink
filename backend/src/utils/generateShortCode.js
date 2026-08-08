const CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;

/**
 * Generates a random alphanumeric short code.
 * WHY a pure function: it takes no arguments from the DB and has no side
 * effects — that makes it trivial to unit test ("does it always return
 * 6 characters from the allowed set?") without spinning up MongoDB.
 */
function generateShortCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return code;
}

module.exports = generateShortCode;
