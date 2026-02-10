import express, { NextFunction, Request, Response } from "express"
import config from "./config"
import initDB, { pool } from "./config/db"
import logger from "./middleware/logger"
import { userRoutes } from "./modules/user/user.route"

const app = express()
const port = config.port
app.use(express.json())




initDB()



app.get('/', logger,(req:Request, res:Response) => {
  res.send('Hello next level developers!')
})


// users crud
app.use('/users', userRoutes)

app.use('/users', userRoutes)

app.use('/users', userRoutes)

app.use('/users', userRoutes)

app.use('/users', userRoutes )

// todos crud

app.post('/todos', async (req: Request,res:Response)=>{

    const {user_id,title} = req.body;
    

    try{
        const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1,$2) 
            RETURNING *`,[user_id,title])

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
)

app.get('/todos', async(req:Request,res:Response)=>{
    try{
        const result = await pool.query(`SELECT * FROM todos`)

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
})

app.get('/todos/:id', async (req:Request,res:Response)=>{
    try{
        const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [req.params.id])

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
})

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
