function generateSaltPassword(){
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    const userPassword = 'user_password';
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(userPassword, salt);

    console.log(salt);
    console.log(hashedPassword);
}

generateSaltPassword();