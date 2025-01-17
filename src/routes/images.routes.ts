import express from 'express';
import multer from 'multer';
import { uploadImage, getImages, updateImage, deleteImage } from '../controllers/images.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });  // Almacenamos los archivos en memoria

// Rutas CRUD
router.post('/', upload.single('image'), async (req, res) => {
  try {
    await uploadImage(req, res);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}); 

router.get('/', async (req, res) => {
  try {
    await getImages(req, res);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    await updateImage(req, res);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});  // Actualizar imagen

router.delete('/:id', async (req, res) => {
  try {
    await deleteImage(req, res);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});  // Eliminar imagen

export default router;
