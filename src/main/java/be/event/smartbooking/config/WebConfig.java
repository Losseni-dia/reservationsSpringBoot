package be.event.smartbooking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. On trouve le chemin absolu du dossier uploads
        Path uploadDirPath = Paths.get("uploads");
        String uploadPath = uploadDirPath.toFile().getAbsolutePath();

        // 2. On configure le handler.
        // TRÈS IMPORTANT : "file:///" (3 slashs) est souvent requis pour Windows
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + uploadPath + "/");

        System.out.println("--- DIAGNOSTIC IMAGES ---");
        System.out.println("Dossier physique : " + uploadPath);
        System.out.println("Dossier existe ? : " + uploadDirPath.toFile().exists());
        System.out.println("Lien attendu : http://localhost:8080/uploads/ayiti.jpg");
        System.out.println("-------------------------");
    }
}