package be.event.smartbooking.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.User;

public interface UserRepos extends CrudRepository<User, Long> {
    User findByLogin(String login);

    List<User> findByLastname(String lastname);

    User findById(long id);
    
}
