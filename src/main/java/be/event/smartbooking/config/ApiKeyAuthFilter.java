package be.event.smartbooking.config;

import be.event.smartbooking.model.User;
import be.event.smartbooking.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import important
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;

    public ApiKeyAuthFilter(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String apiKey = request.getHeader("X-API-KEY");

        if (apiKey != null && !apiKey.isBlank()) {
            Optional<User> userOpt = apiKeyService.validateKey(apiKey);

            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // --- CORRECTION ICI ---
                // On convertit ta liste de 'Role' en liste de 'SimpleGrantedAuthority'
                List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getRole())) // Suppose que ta classe Role a une méthode getRole() ou getName() qui renvoie le string (ex: "ROLE_ADMIN")
                        .collect(Collectors.toList());

                var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
                // ----------------------

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}