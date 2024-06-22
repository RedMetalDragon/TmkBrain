import bcrypt from "bcrypt";

export function generateSaltPassword(password: string): [string, string] {
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);
  console.log(salt);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(hashedPassword);

  return [salt, hashedPassword];
}
