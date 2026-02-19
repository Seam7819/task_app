import  bcrypt  from 'bcryptjs';
import { pool } from "../../config/db";
import jwt from 'jsonwebtoken';
import config from '../../config';


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
   
    const token = await jwt.sign({name : user.name, email: user.email},config.jwt_secret as string,{
        expiresIn : "7d"
    } );
    console.log(token);

    return {user, token}
}

export const authService = {
    loginUser,
}