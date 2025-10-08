package be.event.smartbooking.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import be.event.smartbooking.model.Type;
import be.event.smartbooking.repository.TypeRepos;

@Service
public class TypeService {

    @Autowired
    private TypeRepos typeRepos;

    public List<Type> getAll() {
        List<Type> types = new ArrayList<>();

        typeRepos.findAll().forEach(types::add);
        return types;
    }

    public Type get(String id) {
        Long indice = (long) Integer.parseInt(id);

        Optional<Type> type = typeRepos.findById(indice);

        return type.isPresent() ? type.get() : null;
    }

    public void addType(Type type) {
        typeRepos.save(type);
    }

    public void updateType(String id, Type type) {
        typeRepos.save(type);
    }

    public void deleteType(String id) {
        Long indice = (long) Integer.parseInt(id);

        typeRepos.deleteById(indice);
    }
    
}
