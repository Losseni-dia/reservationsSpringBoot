package be.event.smartbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.UserRepos;

@Service
public class UserService {
    @Autowired
    private UserRepos userRepos;

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

    public void addUser(User user) {
        userRepos.save(user);
    }

    public void updateUser(long id, User user) {
        userRepos.save(user);
    }

    public void deleteUser(long id) {
        userRepos.deleteById(id);
    }

}
