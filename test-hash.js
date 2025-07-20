import bcrypt from 'bcrypt';

// Password to test
const plainPassword = "123456";

// Hash to verify (your existing hash)
const hash = "$2b$10$XhD4ZWEi2kdeh7f4OAfBe3vlbXZEZV2qY1OrO0GM5LqvkpzQp1s";

// Compare password with hash
bcrypt.compare(plainPassword, hash).then(result => {
  console.log("Does password match?", result);
}).catch(err => console.error("Error:", err));
