package in.sb.SkillSwap.repository;

import in.sb.SkillSwap.model.ProgressTracking;
import in.sb.SkillSwap.model.Session;
import in.sb.SkillSwap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressTrackingRepository extends JpaRepository<ProgressTracking, Long> {
    List<ProgressTracking> findBySession(Session session);
    List<ProgressTracking> findByUser(User user);
    Optional<ProgressTracking> findBySessionAndUserAndSkill(Session session, User user, in.sb.SkillSwap.model.Skill skill);
    
    // Use Boolean parameter or @Query - don't use True suffix directly
    List<ProgressTracking> findByUserAndTaughtConfirmed(User user, Boolean taughtConfirmed);
    List<ProgressTracking> findByUserAndLearnedConfirmed(User user, Boolean learnedConfirmed);
    
    // Or use these @Query annotations for the "true" versions
    @Query("SELECT pt FROM ProgressTracking pt WHERE pt.user = :user AND pt.taughtConfirmed = true")
    List<ProgressTracking> findConfirmedTaughtSkills(@Param("user") User user);
    
    @Query("SELECT pt FROM ProgressTracking pt WHERE pt.user = :user AND pt.learnedConfirmed = true")
    List<ProgressTracking> findConfirmedLearnedSkills(@Param("user") User user);
}