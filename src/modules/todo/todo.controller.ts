import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request,res:Response)=>{

    const {user_id,title} = req.body;
    

    try{
        const result = await todoService.createTodo(user_id,title);

            console.log(result);
        res.status(201).json({
            success: true,
            message: "Todos Created",
            data : result.rows[0]
        })
    }catch(err : any){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

const getTodo = async(req:Request,res:Response)=>{
    try{
        const result = await todoService.getTodo();

        res.status(200).json({
            success: true,
            message: "All data get",
            data : result.rows
        })
    }catch(err : any){
        res.status(500).json({
            success: false,
            message : err.message
        })
    }
}

const getSingleTodo = async (req:Request,res:Response)=>{
    try{
        const result = await todoService.getSingleTodo(req.params.id as string);

        if(result.rows.length === 0 ){
            res.status(404).json({
                success: false,
                message : "Not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message : "data found",
                data : result.rows[0]
            })
        }
    }catch (err : any) {
        res.status(500).json({
            success: false,
            message : "data not found"
        })
    }
}

export const todoController = {
    createTodo,
    getTodo,
    getSingleTodo
}