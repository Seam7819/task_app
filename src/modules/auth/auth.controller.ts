import { Request, Response } from "express";
import { authService } from "./auth.service";

const userLogin = async (req: Request, res: Response) =>{
    const {email,password} = req.body;

    try{
            const result = await authService.loginUser(email,password);
    
                console.log(result);
            res.status(201).json({
                success: true,
                message: "Todos Created",
                data : result
            })
        }catch(err : any){
            res.status(500).json({
                success : false,
                message : err.message
            })
        }
}

export const authController = {
    userLogin,
}