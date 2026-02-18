package be.event.smartbooking.config;

import be.event.smartbooking.service.ApiKeyService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SpringSecurityConfig {

        @Autowired // Injection du service pour le filtre
        private ApiKeyService apiKeyService;

        @Bean
        public SecurityFilterChain configure(HttpSecurity http) throws Exception {
                // Création de notre filtre personnalisé
                ApiKeyAuthFilter apiKeyFilter = new ApiKeyAuthFilter(apiKeyService);

                return http
                                .cors(Customizer.withDefaults())
                                // 1. Désactivation du CSRF pour autoriser les requêtes POST/Multipart de React
                                .csrf(csrf -> csrf.disable())

                                // --- AJOUT DU FILTRE API KEY AVANT LE FILTRE LOGIN CLASSIQUE ---
                                .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)

                                .authorizeHttpRequests(auth -> auth
                                                // 2. Les règles spécifiques (POST) DOIVENT être avant les règles
                                                // générales
                                            

                                                // 3. Les accès publics (GET)
                                                .requestMatchers(HttpMethod.GET, "/api/shows/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/artist-types/**").permitAll()

                                                // 4. Authentification & Profil
                                                .requestMatchers("/api/users/login", "/api/users/register").permitAll()
                                                .requestMatchers("/uploads/**", "/css/**", "/js/**").permitAll()
                                                .requestMatchers("/api/users/reset-password").permitAll()
                                                .requestMatchers("/api/users/forgot-password").permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers("/api/rss").permitAll()

                                                // --- DOCUMENTATION SWAGGER (OPEN API) ---
                                                // Autoriser l'accès à la doc pour tout le monde
                                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                                                // --- API EXTERNE SÉCURISÉE ---
                                                // Les routes /api/public/** nécessiteront soit d'être logué, soit d'avoir une clé API valide
                                                // (Le filtre s'en occupe avant d'arriver ici)
                                                .requestMatchers("/api/public/**").authenticated()
                                               

                                                // 2. Seuls les utilisateurs connectés peuvent poster un avis
                                                .requestMatchers(HttpMethod.POST, "/api/reviews").authenticated()
                                               

                                                

                                                // 5. Administration
                                                .requestMatchers("/api/admin/**").hasAnyRole("admin", "ADMIN")
                                                // On protège le GET (lister) et le DELETE sur /api/users
                                                .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("admin", "ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAnyRole("admin", "ADMIN")
                                                // Seul un ADMIN peut supprimer un avis (modération)
                                                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**")
                                                .hasAnyRole("admin", "ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/shows/**")
                                                .hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE")
                                                .requestMatchers(HttpMethod.PUT, "/api/shows/**")
                                                .hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE")
                                                .requestMatchers(HttpMethod.DELETE, "/api/shows/**")
                                                .hasAnyRole("admin", "ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/shows/*/representations")
                                                .hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE", "PRODUCER")
                                                .requestMatchers(HttpMethod.DELETE, "/api/representations/*")
                                                .hasAnyRole("admin", "affiliate", "ADMIN", "AFFILIATE", "PRODUCER")
                                                
                                                // Tout le reste nécessite d'être connecté
                                                .anyRequest().authenticated())

                                .formLogin(form -> form
                                                .loginProcessingUrl("/api/users/login")
                                                .usernameParameter("login")
                                                .successHandler((req, res, auth) -> res
                                                                .setStatus(HttpServletResponse.SC_OK))
                                                .failureHandler((req, res, exc) -> res.sendError(
                                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                                "Identifiants incorrects")))

                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((req, res, authEx) -> res
                                                                .sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                                                                "Non autorisé")))

                                .logout(logout -> logout
                                                .logoutUrl("/api/users/logout")
                                                .logoutSuccessHandler((req, res, auth) -> res
                                                                .setStatus(HttpServletResponse.SC_OK))
                                                .invalidateHttpSession(true)
                                                .deleteCookies("JSESSIONID"))
                                .build();
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