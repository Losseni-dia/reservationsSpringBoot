package be.event.smartbooking.repository;

import be.event.smartbooking.model.TranslationUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TranslationUsageRepository extends JpaRepository<TranslationUsage, Long> {

    @Query("SELECT COALESCE(SUM(t.charactersTranslated), 0) FROM TranslationUsage t WHERE t.createdAt >= :since")
    long sumCharactersSince(@Param("since") LocalDateTime since);
}
