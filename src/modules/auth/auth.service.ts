import  bcrypt  from 'bcryptjs';
import { pool } from "../../config/db";
import jwt from 'jsonwebtoken';


const loginUser = async (email : string , password : string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0]
    const matchedPass = await bcrypt.compare(password, user.password);
    if (!matchedPass){
        return false;
    }
    const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
    const token = await jwt.sign({name : user.name, email: user.email},secret,{
        expiresIn : "7d"
    } );
    console.log(token);

    return {user, token}
}

export const authService = {
    loginUser,
}