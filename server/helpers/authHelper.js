import bcrypt from "bcrypt"

//for password bcryption
//yahan pr jo password as a argument recieve kr rahy hain usy authcontroller me pass krwa rahy hain
export const hashpassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password, saltRounds)
        return hashedpassword;
    } catch (error) {
        // console.log(error)
    }
}

//for comparing password

export const comparepassword = async (password, hashedpassword) => {
    return bcrypt.compare(password, hashedpassword);
}