package in.sb.SkillSwap.repository;

import in.sb.SkillSwap.model.Session;
import in.sb.SkillSwap.model.SessionStatus;
import in.sb.SkillSwap.model.SwapRequest;
import in.sb.SkillSwap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findBySwapRequest(SwapRequest swapRequest);
    
    // Find sessions where user is either sender or receiver
    @Query("SELECT s FROM Session s WHERE s.swapRequest.sender = :user OR s.swapRequest.receiver = :user")
    List<Session> findByUser(@Param("user") User user);
    
    List<Session> findByStatus(SessionStatus status);
    
    // Find sessions by user and status
    @Query("SELECT s FROM Session s WHERE (s.swapRequest.sender = :user OR s.swapRequest.receiver = :user) AND s.status = :status")
    List<Session> findByUserAndStatus(@Param("user") User user, @Param("status") SessionStatus status);
    
    // Find upcoming sessions
    @Query("SELECT s FROM Session s WHERE s.scheduledDate IS NOT NULL AND s.scheduledDate > :start AND s.status = 'SCHEDULED'")
    List<Session> findUpcomingSessions(@Param("start") LocalDateTime start);
}