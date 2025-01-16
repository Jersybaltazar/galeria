import express  from 'express';
import multer from 'multer';
import { uploadImage, getImages, updateImage, deleteImage } from '../controllers/images.controller';

const router =  express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// Rutas CRUD
router.post('/', upload.single('image'), uploadImage); // Subir imagen
router.get('/', getImages); // Listar imágenes
//router.put('/:id', updateImage); 
router.delete('/:id', deleteImage); 

export default router;
