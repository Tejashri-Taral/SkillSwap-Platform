package in.sb.SkillSwap.repository;

import in.sb.SkillSwap.model.Skill;
import in.sb.SkillSwap.model.User;
import in.sb.SkillSwap.model.UserTeachSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTeachSkillRepository extends JpaRepository<UserTeachSkill, Long> {
    List<UserTeachSkill> findByUser(User user);
    List<UserTeachSkill> findBySkill(Skill skill);
    Optional<UserTeachSkill> findByUserAndSkill(User user, Skill skill);
    boolean existsByUserAndSkill(User user, Skill skill);
    void deleteByUserAndSkill(User user, Skill skill);
    List<UserTeachSkill> findBySkillIn(List<Skill> skills);
}