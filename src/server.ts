import express, { Request, Response } from "express"
import {Pool} from "pg"
import dotenv from "dotenv"
import path from "path"
const app = express()
const port = 5000
app.use(express.json())

dotenv.config({path: path.join(process.cwd(), ".env")})

const pool = new Pool({
    connectionString : `${process.env.CONNECTION_STR}`,
    // ssl: { rejectUnauthorized: false }
    
})


const initDB = async () =>{
    await pool.query(`CREATE TABLE IF NOT EXISTS users
        (
        id SERIAL PRIMARY  KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`
    )
    await pool.query(`CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY  KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`)
}

initDB()

app.get('/', (req:Request, res:Response) => {
  res.send('Hello next level developers!')
})


// users crud
app.post('/users', async(req:Request,res :Response)=>{
    const {name,email} = req.body;

    try{
        const result = await pool.query(`INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
            [name,email]
        );
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
})

app.get('/users', async(req:Request,res:Response)=>{
    try{
        const result = await pool.query(`SELECT * FROM users`)
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
})

app.get('/users/:id', async (req:Request, res:Response)=>{

    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
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
})

app.put('/users/:id', async (req:Request, res:Response)=>{

    const {name,email} = req.body;
    try{
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id = $3 RETURNING *`, [name,email,req.params.id])
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
})

app.delete('/users/:id', async (req:Request, res:Response)=>{

    try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id])
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
})

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
