import bcrypt from 'bcrypt';

function generateSaltPassword(){
    const saltRounds = 10;

    const userPassword = 'user_password';
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(userPassword, salt);

    console.log(salt);
    console.log(hashedPassword);
}

generateSaltPassword();