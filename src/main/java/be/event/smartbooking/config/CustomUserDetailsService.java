package be.event.smartbooking.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.DisabledException;;;
import be.event.smartbooking.model.Role;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.UserRepos;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepos userRepository;

    @Override
    @Transactional(readOnly = true) // Crucial pour éviter les erreurs de Lazy Loading sur les rôles
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final User user = userRepository.findByLogin(username);
        if (user == null) {
            throw new UsernameNotFoundException("User " + username + " not found");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getLogin(),
                user.getPassword(),
                getGrantedAuthorities(user.getRoles()));
    }

    private List<GrantedAuthority> getGrantedAuthorities(List<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (roles != null) {
            for (Role role : roles) {
                // On transforme 'admin' en 'ROLE_ADMIN' pour matcher hasRole('ADMIN')
                String roleName = role.getRole().toUpperCase();
                if (!roleName.startsWith("ROLE_")) {
                    roleName = "ROLE_" + roleName;
                }
                authorities.add(new SimpleGrantedAuthority(roleName));
            }
        }
        return authorities;
    }
   
}
