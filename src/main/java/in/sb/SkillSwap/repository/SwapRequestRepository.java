package in.sb.SkillSwap.repository;

import in.sb.SkillSwap.model.SwapRequest;
import in.sb.SkillSwap.model.SwapRequestStatus;
import in.sb.SkillSwap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    List<SwapRequest> findBySender(User sender);
    List<SwapRequest> findByReceiver(User receiver);
    List<SwapRequest> findBySenderAndStatus(User sender, SwapRequestStatus status);
    List<SwapRequest> findByReceiverAndStatus(User receiver, SwapRequestStatus status);
    List<SwapRequest> findBySenderOrReceiver(User user1, User user2);
    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, SwapRequestStatus status);
}