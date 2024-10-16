import bcrypt from "bcrypt";

export function generateSaltPassword(password: string): [string, string] {
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);
  console.log(salt);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(hashedPassword);

  return [salt, hashedPassword];
}

export function generateStrongPassword(length = 10): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  // Combine all the characters
  const allChars = uppercase + lowercase + numbers + specialChars;

  // Ensure the password has at least one of each type of character
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the remaining characters with random choices from all characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to avoid predictable patterns
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}
