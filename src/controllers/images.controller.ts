import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Simularemos una base de datos temporal para las imágenes
let images: { id: string; url: string; publicId: string }[] = [];

// Subir imagen
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file; // Obtenemos el archivo subido
    if (!file) {
      res.status(400).json({ message: "No se proporcionó ninguna imagen" });
      return;
    }

    const result = await cloudinary.uploader
      .upload_stream({ folder: "crud-images" }, (error, result) => {
        if (error) {
          res.status(500).json({ error: error.message });
          return;
        }
        res.status(200).json(result);
      })
      .end(file.buffer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las imágenes
export const getImages = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: "crud-images",
    });
    res.status(200).json(resources);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar imagen (solo como referencia, porque normalmente no se actualizan imágenes en Cloudinary)
export const updateImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { url } = req.body;

  const image = images.find((img) => img.id === id);
  if (!image) return res.status(404).json({ message: "Imagen no encontrada" });

  image.url = url; // Simulación de actualización
  res.status(200).json({ message: "Imagen actualizada", data: image });
};

// Eliminar imagen
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Capturamos el parámetro de la URL
  console.log("ID recibido para eliminar:", id); 
  try {
    const result = await cloudinary.uploader.destroy(id);
    if (result.result !== "ok") {
      res.status(500).json({ message: "No se pudo eliminar la imagen en Cloudinary" });
      return
    }
    res.status(200).json({ message: "Imagen eliminada exitosamente" });
  } catch (error: any) {
    console.error("Error al intentar eliminar la imagen:", error);
    res.status(500).json({ error: error.message });
  }
};

