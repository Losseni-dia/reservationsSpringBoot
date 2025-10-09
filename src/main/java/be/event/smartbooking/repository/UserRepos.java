package be.event.smartbooking.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.User;

public interface UserRepos extends CrudRepository<User, Long> {
    User findById(long id);

    User findByLogin(String login);
    User findByEmail(String email);

    List<User> findByLastname(String lastname);

   
    
}
