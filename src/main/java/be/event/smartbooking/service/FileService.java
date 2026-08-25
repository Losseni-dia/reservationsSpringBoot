package be.event.smartbooking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileService {

    @Value("${upload.path}")
    private String uploadPath;

    public String save(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty())
            return null;

        // 1. Créer le dossier s'il n'existe pas
        Path root = Paths.get(uploadPath);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        // 2. Générer un nom unique pour éviter d'écraser des fichiers existants
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // 3. Copier le fichier dans le dossier uploads
        Files.copy(file.getInputStream(), root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        // 4. Retourner l'URL relative pour la DB (ex: /uploads/image.jpg)
        return "/uploads/" + filename;
    }
}