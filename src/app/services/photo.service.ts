import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  // Devuelve una promesa con la ruta web y el archivo File listo para subir
  async tomarFoto(): Promise<{ webPath: string, file: File } | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt // Pregunta al usuario: Cámara o Galería
      });

      if (image.webPath) {
        // Truco para convertir la ruta de Capacitor a un objeto File de JS
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], 'plan_image.jpg', { type: 'image/jpeg' });

        return {
          webPath: image.webPath,
          file: file
        };
      }
      return null;
    } catch (e) {
      // El usuario canceló o hubo error
      return null;
    }
  }
}