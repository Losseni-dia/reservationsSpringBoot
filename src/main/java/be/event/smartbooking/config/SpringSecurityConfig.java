package be.event.smartbooking.config;

import be.event.smartbooking.service.ApiKeyService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SpringSecurityConfig {

    @Autowired
    private ApiKeyService apiKeyService;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        // Création de notre filtre personnalisé
        ApiKeyAuthFilter apiKeyFilter = new ApiKeyAuthFilter(apiKeyService);

        return http
                // 1. Activation de CORS avec notre configuration spécifique (voir méthode plus bas)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // 2. Désactivation du CSRF pour autoriser les requêtes POST/Multipart de React
                .csrf(csrf -> csrf.disable())

                // --- AJOUT DU FILTRE API KEY AVANT LE FILTRE LOGIN CLASSIQUE ---
                .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(auth -> auth
                        // 3. Les accès publics (GET)
                        .requestMatchers(HttpMethod.GET, "/api/shows/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/artist-types/**").permitAll()

                        // 4. Authentification & Profil
                        .requestMatchers("/api/users/login", "/api/users/register").permitAll()
                        .requestMatchers("/uploads/**", "/css/**", "/js/**").permitAll()
                        .requestMatchers("/api/users/reset-password", "/api/users/forgot-password").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/rss").permitAll()

                        // --- DOCUMENTATION SWAGGER (OPEN API) ---
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // --- API EXTERNE SÉCURISÉE ---
                        .requestMatchers("/api/public/**").authenticated()

                        // Gestion des clés API (Nécessite d'être connecté)
                        .requestMatchers("/api/users/keys").authenticated()

                        // 2. Seuls les utilisateurs connectés peuvent poster un avis
                        .requestMatchers(HttpMethod.POST, "/api/reviews").authenticated()

                        // 5. Administration
                        .requestMatchers("/api/admin/**").hasAnyRole("admin", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("admin", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAnyRole("admin", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAnyRole("admin", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/shows/**").hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE")
                        .requestMatchers(HttpMethod.PUT, "/api/shows/**").hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE")
                        .requestMatchers(HttpMethod.DELETE, "/api/shows/**").hasAnyRole("admin", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/shows/*/representations").hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE", "PRODUCER")
                        .requestMatchers(HttpMethod.DELETE, "/api/representations/*").hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE", "PRODUCER")
                        
                        // Tout le reste nécessite d'être connecté
                        .anyRequest().authenticated())

                .formLogin(form -> form
                        .loginProcessingUrl("/api/users/login")
                        .usernameParameter("login")
                        .successHandler((req, res, auth) -> res.setStatus(HttpServletResponse.SC_OK))
                        .failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Identifiants incorrects")))

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Non autorisé")))

                .logout(logout -> logout
                        .logoutUrl("/api/users/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(HttpServletResponse.SC_OK))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"))
                .build();
    }

    /**
     * Configuration CORS pour autoriser le Frontend React (port 3000)
     * à communiquer avec ce Backend (port 8080)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autorise le port 3000 (React)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        
        // Autorise les méthodes HTTP courantes
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Autorise les headers nécessaires (dont X-API-KEY)
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "X-API-KEY", "X-Requested-With"));
        
        // Autorise l'envoi des cookies (Session ID) pour rester connecté
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}