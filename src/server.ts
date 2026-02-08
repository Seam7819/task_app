import express, { Request, Response } from "express"
import {Pool} from "pg"
const app = express()
const port = 5000
app.use(express.json())

const pool = new Pool({
    connectionString : `${process.env.CONNECTION_STR}`
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
        tittle VARCHAR(200) NOT NULL,
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

app.post('/users',(req,res)=>{
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "Api is working"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
