import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async(req:Request,res :Response)=>{
    const {name,email} = req.body;

    try{
        const result = await userService.createUser(name,email)
        res.status(200).json({
            success: true,
            message : "Data inserted Successfully",
            data : result.rows[0]
        })
    }catch(err : any ){
        res.status(500).json({
            success: false,
            message : err.message
        })
    }
}

const getUser = async(req:Request,res:Response)=>{
    try{
        const result = await userService.getUser()
        res.status(200).json({
            success: true,
            message: "data retrieved successfully",
            data : result.rows
        })
    }catch(err : any){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const getSingleUser = async (req:Request, res:Response)=>{

    try{
        const result = await userService.getSingleUSer(req.params.id as string)
        // console.log(result.rows);
        if(result.rows.length === 0){
            res.status(404).json({
                success : false,
                message : " not found"
            }
        )
        }else{
            res.status(200).json({
                success: true,
                data : result.rows[0]
            })
        }
    }catch(err : any){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const updateUser = async (req:Request, res:Response)=>{

    const {name,email} = req.body;
    try{
        const result = await userService.updateUser(name,email,req.params.id as string);
        // console.log(result.rows);
        if(result.rows.length === 0){
            res.status(404).json({
                success : false,
                message : " not found"
            }
        )
        }else{
            res.status(200).json({
                success: true,
                data : result.rows[0]
            })
        }
    }catch(err : any){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const deleteUser = async (req:Request, res:Response)=>{

    try{
        const result = await userService.deleteUser(req.params.id as string)
        // console.log(result.rows);
        if(result.rowCount === 0){
            res.status(404).json({
                success : false,
                message : " not found"
            }
        )
        }else{
            res.status(200).json({
                success: true,
                data : result.rows
            })
        }
    }catch(err : any){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const userControllers = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
}