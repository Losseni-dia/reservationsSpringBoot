package be.event.smartbooking.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API SmartBooking",
                version = "1.0",
                description = "**Tous les spectacles et tous les textes contemporains édités en scène.**\n" +
                              "Une plateforme interprofessionnelle participative au service du grand public.\n\n" +
                              "---\n\n" +
                              "### 📖 Mode d'emploi\n" +
                              "L'ensemble des données (spectacles, représentations, lieux, avis) sont disponibles pour votre usage via cette API.\n\n" +
                              "### 💡 Exemples d'usages\n" +
                              "- **Éditeurs :** Récupérer tous les spectacles à l'affiche.\n" +
                              "- **Compagnies :** Afficher les représentations en tournée.\n" +
                              "- **Partenaires :** Intégrer les avis et les notes sur vos propres sites.\n\n" +
                              "### 🔐 Utiliser via l'API (Clé)\n" +
                              "L'accès à certaines données (notamment `/api/public/**`) nécessite une clé API. \n" +
                              "Vous pouvez générer votre clé depuis votre espace profil. Ajoutez-la ensuite en cliquant sur le bouton **Authorize** ci-dessous."
        ),
        // Applique la sécurité globale (le cadenas apparaîtra sur toutes les routes)
        security = {
                @SecurityRequirement(name = "ApiKeyAuth")
        }
)
@SecurityScheme(
        name = "ApiKeyAuth",
        description = "Entrez votre clé API générée (ex: sk_...). Elle sera envoyée dans le header `X-API-KEY`.",
        type = SecuritySchemeType.APIKEY,
        in = SecuritySchemeIn.HEADER,
        paramName = "X-API-KEY" // C'est exactement le nom attendu par ton ApiKeyAuthFilter !
)
public class OpenApiConfig {
        // On dit à Swagger de n'afficher QUE les routes B2B
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("b2b-api")
                .pathsToMatch("/api/public/**") // Seules les URL commençant par /api/public apparaîtront !
                .build();
    }
}