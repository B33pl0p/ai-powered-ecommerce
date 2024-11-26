import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for __dirname in ES modules

// Get the directory name equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3400;

// Serve static images from the correct directory
const imagesPath = path.resolve('/home/biplop/ai-powered-ecommerce/database/data/images');
app.use('/images', express.static(imagesPath));

// Enable cross-origin resource sharing
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// PostgreSQL database connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fashion_db',
    password: '7878',
    port: 5432,
});

// Root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to the Reverse Image Search API!');
});

// Products endpoint to fetch product data with image URLs
app.get('/products', async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        const result = await client.query('SELECT product_id, product_display_name, price, rating FROM products');
        client.release();

        // Map product data to include public image URLs
        const productWithImageUrls = result.rows.map((product) => {
            product.imageUrl = `http://localhost:${port}/images/${product.product_id}.jpg`; // Serve from the /images route
            return product;
        });

        res.status(200).json(productWithImageUrls);
        console.log(result.rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});