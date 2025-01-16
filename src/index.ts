import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import imageRoutes from '../src/routes/images.routes'

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes)

// Ruta base
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de imágenes');
});

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
