package be.event.smartbooking.validation;


import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj instanceof UserRegistrationDto) {
            UserRegistrationDto dto = (UserRegistrationDto) obj;
            if (dto.getPassword() == null || dto.getConfirmPassword() == null) {
                return false;
            }
            return dto.getPassword().equals(dto.getConfirmPassword());
        }

        if (obj instanceof UserProfileDto) {
            UserProfileDto dto = (UserProfileDto) obj;
            // Si le mot de passe est vide (pas de modification), c'est valide
            if (dto.getPassword() == null || dto.getPassword().isBlank()) {
                return true;
            }
            // Sinon, il doit correspondre à la confirmation
            return dto.getPassword().equals(dto.getConfirmPassword());
        }

        return false;
    }
}
