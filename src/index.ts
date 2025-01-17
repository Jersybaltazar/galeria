import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import imageRoutes from '../src/routes/images.routes'

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000", // Ajusta según el dominio frontend
  methods: ["GET", "POST", "DELETE", "PUT"],
}));
app.use(express.json());

app.use('/api/images', imageRoutes)


app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});
// Manejador de errores general
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
