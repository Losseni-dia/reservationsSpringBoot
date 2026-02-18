package be.event.smartbooking.config;

import be.event.smartbooking.model.User;
import be.event.smartbooking.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;

    public ApiKeyAuthFilter(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Chercher le header "X-API-KEY"
        String apiKey = request.getHeader("X-API-KEY");

        // 2. Si présent, on valide
        if (apiKey != null && !apiKey.isBlank()) {
            Optional<User> userOpt = apiKeyService.validateKey(apiKey);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // 3. On connecte l'utilisateur virtuellement pour cette requête
                var auth = new UsernamePasswordAuthenticationToken(user, null, user.getRoles()); // Utilise tes rôles existants
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // 4. On laisse passer la requête (Spring Security décidera si c'est autorisé ou non après)
        filterChain.doFilter(request, response);
    }
}
