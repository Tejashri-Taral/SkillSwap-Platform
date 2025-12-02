package in.sb.SkillSwap.service;

import in.sb.SkillSwap.dto.SkillDTO;
import in.sb.SkillSwap.dto.UserSkillRequest;
import in.sb.SkillSwap.dto.UserSkillResponse;
import in.sb.SkillSwap.exception.AuthException;
import in.sb.SkillSwap.model.Skill;
import in.sb.SkillSwap.model.User;
import in.sb.SkillSwap.model.UserLearnSkill;
import in.sb.SkillSwap.model.UserTeachSkill;
import in.sb.SkillSwap.repository.SkillRepository;
import in.sb.SkillSwap.repository.UserLearnSkillRepository;
import in.sb.SkillSwap.repository.UserRepository;
import in.sb.SkillSwap.repository.UserTeachSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTeachSkillRepository userTeachSkillRepository;

    @Autowired
    private UserLearnSkillRepository userLearnSkillRepository;

    @Autowired
    private UserService userService;

    // Skill Management Methods
    public Skill createOrGetSkill(String name, String category, String description) {
        Optional<Skill> existingSkill = skillRepository.findByName(name);
        
        if (existingSkill.isPresent()) {
            return existingSkill.get();
        }
        
        Skill newSkill = new Skill(name, description, category);
        return skillRepository.save(newSkill);
    }

    public List<SkillDTO> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        return convertToSkillDTOList(skills);
    }

    public List<SkillDTO> searchSkills(String query) {
        List<Skill> skills = skillRepository.findByNameContainingIgnoreCase(query);
        return convertToSkillDTOList(skills);
    }

    public List<SkillDTO> getSkillsByCategory(String category) {
        List<Skill> skills = skillRepository.findByCategory(category);
        return convertToSkillDTOList(skills);
    }

    // User Teach Skills Methods
    @Transactional
    public UserSkillResponse addTeachSkill(Long userId, UserSkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        Skill skill = createOrGetSkill(
            request.getSkillName(), 
            request.getCategory(), 
            request.getDescription()
        );

        // Check if already exists
        if (userTeachSkillRepository.existsByUserAndSkill(user, skill)) {
            throw new AuthException("Skill already added to teach list");
        }

        UserTeachSkill userTeachSkill = new UserTeachSkill(
            user, 
            skill, 
            request.getLevel(), 
            request.getGoal()
        );

        UserTeachSkill saved = userTeachSkillRepository.save(userTeachSkill);
        return convertToUserSkillResponse(saved);
    }
    
    public Skill getSkillById(Long skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new AuthException("Skill not found"));
    }

    public List<UserSkillResponse> getTeachSkills(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        List<UserTeachSkill> teachSkills = userTeachSkillRepository.findByUser(user);
        return convertToUserTeachSkillResponseList(teachSkills);
    }

    @Transactional
    public void removeTeachSkill(Long userId, Long skillId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new AuthException("Skill not found"));

        userTeachSkillRepository.deleteByUserAndSkill(user, skill);
    }

    // User Learn Skills Methods
    @Transactional
    public UserSkillResponse addLearnSkill(Long userId, UserSkillRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        Skill skill = createOrGetSkill(
            request.getSkillName(), 
            request.getCategory(), 
            request.getDescription()
        );

        // Check if already exists
        if (userLearnSkillRepository.existsByUserAndSkill(user, skill)) {
            throw new AuthException("Skill already added to learn list");
        }

        UserLearnSkill userLearnSkill = new UserLearnSkill(
            user, 
            skill, 
            request.getLevel(), 
            request.getGoal()
        );

        UserLearnSkill saved = userLearnSkillRepository.save(userLearnSkill);
        return convertToUserSkillResponse(saved);
    }

    public List<UserSkillResponse> getLearnSkills(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        List<UserLearnSkill> learnSkills = userLearnSkillRepository.findByUser(user);
        return convertToUserLearnSkillResponseList(learnSkills);
    }

    @Transactional
    public void removeLearnSkill(Long userId, Long skillId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new AuthException("Skill not found"));

        userLearnSkillRepository.deleteByUserAndSkill(user, skill);
    }

    // Helper Methods
    private SkillDTO convertToSkillDTO(Skill skill) {
        return new SkillDTO(
            skill.getId(),
            skill.getName(),
            skill.getDescription(),
            skill.getCategory()
        );
    }

    private List<SkillDTO> convertToSkillDTOList(List<Skill> skills) {
        List<SkillDTO> skillDTOs = new ArrayList<>();
        for (Skill skill : skills) {
            skillDTOs.add(convertToSkillDTO(skill));
        }
        return skillDTOs;
    }

    private UserSkillResponse convertToUserSkillResponse(UserTeachSkill userTeachSkill) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new UserSkillResponse(
            userTeachSkill.getId(),
            convertToSkillDTO(userTeachSkill.getSkill()),
            userTeachSkill.getProficiencyLevel(),
            userTeachSkill.getTeachingExperience(),
            userTeachSkill.getCreatedAt().format(formatter)
        );
    }

    private UserSkillResponse convertToUserSkillResponse(UserLearnSkill userLearnSkill) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new UserSkillResponse(
            userLearnSkill.getId(),
            convertToSkillDTO(userLearnSkill.getSkill()),
            userLearnSkill.getCurrentLevel(),
            userLearnSkill.getLearningGoal(),
            userLearnSkill.getCreatedAt().format(formatter)
        );
    }

    private List<UserSkillResponse> convertToUserTeachSkillResponseList(List<UserTeachSkill> teachSkills) {
        List<UserSkillResponse> responses = new ArrayList<>();
        for (UserTeachSkill teachSkill : teachSkills) {
            responses.add(convertToUserSkillResponse(teachSkill));
        }
        return responses;
    }

    private List<UserSkillResponse> convertToUserLearnSkillResponseList(List<UserLearnSkill> learnSkills) {
        List<UserSkillResponse> responses = new ArrayList<>();
        for (UserLearnSkill learnSkill : learnSkills) {
            responses.add(convertToUserSkillResponse(learnSkill));
        }
        return responses;
    }

    // Get skills for matching algorithm (will be used in next step)
    public List<Skill> getTeachSkillsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));
        
        List<UserTeachSkill> teachSkills = userTeachSkillRepository.findByUser(user);
        List<Skill> skills = new ArrayList<>();
        for (UserTeachSkill teachSkill : teachSkills) {
            skills.add(teachSkill.getSkill());
        }
        return skills;
    }

    public List<Skill> getLearnSkillsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));
        
        List<UserLearnSkill> learnSkills = userLearnSkillRepository.findByUser(user);
        List<Skill> skills = new ArrayList<>();
        for (UserLearnSkill learnSkill : learnSkills) {
            skills.add(learnSkill.getSkill());
        }
        return skills;
    }
}