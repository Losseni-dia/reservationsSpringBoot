package be.event.smartbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.Role;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.RoleRepos;
import be.event.smartbooking.repository.UserRepos;

@Service
public class UserService {
    @Autowired
    private UserRepos userRepos;

    @Autowired
    private RoleRepos roleRepos;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepos.findAll().forEach(users::add);
        return users;
    }

    public User getUserById(long id) {
        return userRepos.findById(id);
    }

    public User findByEmail(String email) {
        return userRepos.findByEmail(email).orElse(null);
    }

    public void registerFromDto(UserRegistrationDto dto) {
        User user = new User();
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setLogin(dto.getLogin());
        user.setEmail(dto.getEmail());
        user.setLangue(dto.getLangue());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        Role memberRole = roleRepos.findByRole("MEMBER"); // récupérer l'objet Role depuis la BD
        List<Role> roles = new ArrayList<>();
        roles.add(memberRole);
        user.setRoles(roles);
        userRepos.save(user);
    }


    public void updateUser(long id, User user) {
        userRepos.save(user);
    }

    public void deleteUser(long id) {
        userRepos.deleteById(id);
    }

    public void deleteByLogin(String login) {
        User user = userRepos.findByLogin(login);
        userRepos.delete(user);
    }

    public boolean isLoginAndEmailAvailable(String login, String email) {
        return !userRepos.existsByLogin(login) && !userRepos.existsByEmail(email);
    }
    
        public void updateUserFromDto(UserProfileDto dto) {
        User user = userRepos.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setLangue(dto.getLangue());

        // Si un nouveau mot de passe est fourni et validé
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepos.save(user);
    }



 


}
