package be.event.smartbooking.repository;

import be.event.smartbooking.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // Pour afficher dans le profil utilisateur
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);
}