import express, { NextFunction, Request, Response } from "express"
import config from "./config"
import initDB, { pool } from "./config/db"
import logger from "./middleware/logger"
import { userRoutes } from "./modules/user/user.route"
import { todoRouter } from "./modules/todo/todo.routes"
import { authRoutes } from "./modules/auth/auth.routes"

const app = express()
const port = config.port
app.use(express.json())




initDB()



app.get('/', logger,(req:Request, res:Response) => {
  res.send('Hello next level developers!')
})


// users crud
app.use('/users', userRoutes)

// todos crud

app.use('/todos', todoRouter);

app.put('/todos/:id', async(req:Request, res: Response)=>{
    const {user_id,title} = req.body;

    try{
        const result = await pool.query(`UPDATE todos SET user_id=$1 , title =$2 WHERE id = $3 RETURNING *`, [user_id,title,req.params.id])

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
    }catch(err: any) {
        res.status(500).json({
            success: false,
            message : "Data not updated"
        })
    }
})

app.delete("/todo/:id", (req: Request, res : Response)=>{

})

// auth crud

app.use('/auth', authRoutes);

app.use((req:Request,res:Response)=>{
    res.status(404).json({
        success: false,
        message : "route not found",
        path: req.path
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
