package be.event.smartbooking.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 60, message = "Le prénom doit contenir entre 2 et 60 caractères")
    private String firstname;

    @NotBlank(message = "Le nom est obligatoire")  
    @Size(min = 2, max = 60, message = "Le nom doit contenir entre 2 et 60 caractères")
    private String lastname;


    @Override
    public String toString() {
        return firstname + " " + lastname;
    }


}
