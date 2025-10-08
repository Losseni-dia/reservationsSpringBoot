package be.event.smartbooking.repository;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Role;

public interface RoleRepos extends CrudRepository<Role, Long> {
    Role findByRole(String role);
   
}
