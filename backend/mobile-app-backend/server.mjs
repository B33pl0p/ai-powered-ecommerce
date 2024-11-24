import express from 'express';
import cors from 'cors';
import pkg from 'pg';
//destructure the pool from pg library
const {Pool } = pkg
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for __dirname in ES modules


// Get the directory name equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use('/images', express.static(path.join(__dirname, 'data', 'images')))
app.use(cors());
//cross origin resource sharing ..

app.use(express.json())

const pool = new Pool(
    {
        user : 'postgres',
        host : 'localhost',
        database : 'fashion_db',
        password : '7878',
        port : 5432
    }
) 
app.get('/products', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT product_id, product_display_name, price, rating FROM products')
        client.release();

        const productWithImageUrls = result.rows.map(  (product) =>  {
            product.imageUrl = `/images/${product.product_id}.jpg`;
            return product;
        } )

        res.status(200).json(productWithImageUrls)
        console.log(result.rows)
        
    }
    catch(error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
    
})
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})