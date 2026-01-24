package be.event.smartbooking.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SpringSecurityConfig {

        @Bean
        public SecurityFilterChain configure(HttpSecurity http) throws Exception {
                return http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf
                                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                                                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                                                // AJOUT DU LOGOUT ICI POUR ÉVITER LE DOUBLE CLIC
                                                .ignoringRequestMatchers("/api/users/login", "/api/users/register",
                                                                "/api/users/logout", "/api/users/forgot-password",
                                                                "/api/users/reset-password"))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/shows/**").permitAll()
                                                .requestMatchers("/api/users/login").permitAll()
                                                .requestMatchers("/api/users/register").permitAll()
                                                .requestMatchers("/api/users/forgot-password").permitAll() 
                                                .requestMatchers("/uploads/**", "/css/**", "/js/**", "/login")
                                                .permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
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
                                                                .sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                                .logout(logout -> logout
                                                .logoutUrl("/api/users/logout")
                                                .logoutSuccessHandler((req, res, auth) -> {
                                                        res.setStatus(HttpServletResponse.SC_OK);
                                                })
                                                .invalidateHttpSession(true) // Force la destruction de la session
                                                .deleteCookies("JSESSIONID") // Supprime le cookie
                                )
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