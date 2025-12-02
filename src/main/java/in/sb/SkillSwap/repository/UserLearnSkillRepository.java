package in.sb.SkillSwap.repository;

import in.sb.SkillSwap.model.Skill;
import in.sb.SkillSwap.model.User;
import in.sb.SkillSwap.model.UserLearnSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLearnSkillRepository extends JpaRepository<UserLearnSkill, Long> {
    List<UserLearnSkill> findByUser(User user);
    List<UserLearnSkill> findBySkill(Skill skill);
    Optional<UserLearnSkill> findByUserAndSkill(User user, Skill skill);
    boolean existsByUserAndSkill(User user, Skill skill);
    void deleteByUserAndSkill(User user, Skill skill);
    List<UserLearnSkill> findBySkillIn(List<Skill> skills);
}