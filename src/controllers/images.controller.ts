import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";

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
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "crud-images" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(file.buffer);
    });
    res.status(200).json(result);
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
export const updateImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publicId = req.params.id;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No se proporcionó ninguna imagen para actualizar" });
      return;
    }

    // Asegúrate de que el ID de Cloudinary esté completo
    const fullPublicId = publicId.includes('crud-images/') 
      ? publicId 
      : `crud-images/${publicId}`;

    console.log("Actualizando imagen con ID:", fullPublicId);

    // Eliminar la imagen anterior
    const deleteResult = await cloudinary.uploader.destroy(fullPublicId);
    console.log("Resultado de eliminación:", deleteResult);

    // Subir la nueva imagen con el mismo public_id
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "crud-images",
          public_id: publicId.replace('crud-images/', '') // Usa el ID sin el prefijo de la carpeta
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    console.log("Resultado de la subida:", uploadResult);

    res.status(200).json({
      message: "Imagen actualizada correctamente",
      data: {
        id: uploadResult.public_id,
        url: uploadResult.secure_url,
      }
    });

  } catch (error: any) {
    console.error("Error al actualizar la imagen:", error);
    res.status(500).json({ 
      message: "Error al actualizar la imagen",
      error: error.message 
    });
  }
};

// Eliminar imagen
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const publicId = req.params.id;
    console.log("ID recibido:", publicId);

    // Asegúrate de que el ID de Cloudinary esté completo
    const fullPublicId = publicId.includes('crud-images/') 
      ? publicId 
      : `crud-images/${publicId}`;

    console.log("ID completo para Cloudinary:", fullPublicId);

    const result = await cloudinary.uploader.destroy(fullPublicId);
    console.log("Resultado de Cloudinary:", result);

    if (result.result === "not found") {
      res.status(404).json({
        message: "No se encontró la imagen con el ID proporcionado",
        publicId: fullPublicId
      });
      return;
    }

    res.status(200).json({ 
      message: "Imagen eliminada exitosamente",
      result 
    });
  } catch (error: any) {
    console.error("Error completo:", error);
    res.status(500).json({ 
      message: "Error al eliminar la imagen",
      error: error.message 
    });
  }
};
