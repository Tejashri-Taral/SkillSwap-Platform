package in.sb.SkillSwap.service;

import in.sb.SkillSwap.dto.MatchDTO;
import in.sb.SkillSwap.dto.SkillDTO;
import in.sb.SkillSwap.dto.UserDTO;
import in.sb.SkillSwap.exception.AuthException;
import in.sb.SkillSwap.model.Skill;
import in.sb.SkillSwap.model.User;
import in.sb.SkillSwap.model.UserLearnSkill;
import in.sb.SkillSwap.model.UserTeachSkill;
import in.sb.SkillSwap.repository.UserLearnSkillRepository;
import in.sb.SkillSwap.repository.UserRepository;
import in.sb.SkillSwap.repository.UserTeachSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTeachSkillRepository userTeachSkillRepository;

    @Autowired
    private UserLearnSkillRepository userLearnSkillRepository;

    @Autowired
    private SkillService skillService;

    // Main matching algorithm
    public List<MatchDTO> findMatchesForUser(Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        // Get current user's skills
        List<Skill> currentUserTeachSkills = skillService.getTeachSkillsForUser(userId);
        List<Skill> currentUserLearnSkills = skillService.getLearnSkillsForUser(userId);

        // Get all other users
        List<User> allUsers = userRepository.findAll();
        List<MatchDTO> matches = new ArrayList<>();

        for (User otherUser : allUsers) {
            if (otherUser.getId().equals(userId)) {
                continue; // Skip self
            }

            // Get other user's skills
            List<Skill> otherUserTeachSkills = skillService.getTeachSkillsForUser(otherUser.getId());
            List<Skill> otherUserLearnSkills = skillService.getLearnSkillsForUser(otherUser.getId());

            // Calculate match score
            MatchScore matchScore = calculateMatchScore(
                currentUserTeachSkills, currentUserLearnSkills,
                otherUserTeachSkills, otherUserLearnSkills
            );

            if (matchScore.score > 0) {
                // Create match DTO
                MatchDTO matchDTO = new MatchDTO();
                matchDTO.setUser(convertToUserDTO(otherUser));
                matchDTO.setMatchScore(matchScore.score);
                
                // Find mutual skills
                Skill mutualTeachSkill = findCommonSkill(currentUserLearnSkills, otherUserTeachSkills);
                Skill mutualLearnSkill = findCommonSkill(currentUserTeachSkills, otherUserLearnSkills);
                
                if (mutualTeachSkill != null) {
                    matchDTO.setMutualTeachSkill(convertToSkillDTO(mutualTeachSkill));
                }
                
                if (mutualLearnSkill != null) {
                    matchDTO.setMutualLearnSkill(convertToSkillDTO(mutualLearnSkill));
                }
                
                // Create match description
                String description = generateMatchDescription(
                    mutualTeachSkill, mutualLearnSkill, 
                    matchScore.teachMatchCount, matchScore.learnMatchCount
                );
                matchDTO.setMatchDescription(description);
                
                matches.add(matchDTO);
            }
        }

        // Sort by match score (highest first)
        matches.sort((m1, m2) -> m2.getMatchScore().compareTo(m1.getMatchScore()));

        return matches;
    }

    // Calculate match score between two users
    private MatchScore calculateMatchScore(
            List<Skill> userATeach, List<Skill> userALearn,
            List<Skill> userBTeach, List<Skill> userBLearn) {
        
        int teachMatchCount = 0;
        int learnMatchCount = 0;
        
        // Find skills that user B can teach that user A wants to learn
        for (Skill userALearnSkill : userALearn) {
            for (Skill userBTeachSkill : userBTeach) {
                if (userALearnSkill.getId().equals(userBTeachSkill.getId())) {
                    learnMatchCount++;
                    break;
                }
            }
        }
        
        // Find skills that user A can teach that user B wants to learn
        for (Skill userATeachSkill : userATeach) {
            for (Skill userBLearnSkill : userBLearn) {
                if (userATeachSkill.getId().equals(userBLearnSkill.getId())) {
                    teachMatchCount++;
                    break;
                }
            }
        }
        
        // Calculate total score (weighted)
        int totalScore = (learnMatchCount * 2) + (teachMatchCount * 2);
        
        return new MatchScore(teachMatchCount, learnMatchCount, totalScore);
    }

    // Helper class for match score
    private static class MatchScore {
        int teachMatchCount;
        int learnMatchCount;
        int score;
        
        MatchScore(int teachMatchCount, int learnMatchCount, int score) {
            this.teachMatchCount = teachMatchCount;
            this.learnMatchCount = learnMatchCount;
            this.score = score;
        }
    }

    // Find common skill between two lists
    private Skill findCommonSkill(List<Skill> list1, List<Skill> list2) {
        for (Skill skill1 : list1) {
            for (Skill skill2 : list2) {
                if (skill1.getId().equals(skill2.getId())) {
                    return skill1;
                }
            }
        }
        return null;
    }

    // Generate human-readable match description
    private String generateMatchDescription(Skill teachSkill, Skill learnSkill, 
                                          int teachMatchCount, int learnMatchCount) {
        StringBuilder description = new StringBuilder();
        
        if (teachSkill != null && learnSkill != null) {
            description.append("Perfect match! You can teach ")
                      .append(teachSkill.getName())
                      .append(" and learn ")
                      .append(learnSkill.getName())
                      .append(" from each other.");
        } else if (teachSkill != null) {
            description.append("You can teach ")
                      .append(teachSkill.getName())
                      .append(" to this user.");
        } else if (learnSkill != null) {
            description.append("You can learn ")
                      .append(learnSkill.getName())
                      .append(" from this user.");
        }
        
        if (teachMatchCount > 1 || learnMatchCount > 1) {
            description.append(" Plus ").append(teachMatchCount + learnMatchCount - 1)
                      .append(" additional skill matches!");
        }
        
        return description.toString();
    }

    // Conversion helpers
    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setBio(user.getBio());
        userDTO.setRating(user.getRating());
        userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
        return userDTO;
    }

    private SkillDTO convertToSkillDTO(Skill skill) {
        return new SkillDTO(
            skill.getId(),
            skill.getName(),
            skill.getDescription(),
            skill.getCategory()
        );
    }

    // Find users by skill (for search functionality)
    public Map<String, List<UserDTO>> findUsersBySkill(Long skillId) {
        // This method will be used for searching users who can teach or want to learn a specific skill
        Map<String, List<UserDTO>> result = new HashMap<>();
        
        // Find users who can teach this skill
        List<UserTeachSkill> teachers = userTeachSkillRepository.findBySkill(
            skillService.getSkillById(skillId)
        );
        List<UserDTO> teacherDTOs = new ArrayList<>();
        for (UserTeachSkill teacher : teachers) {
            teacherDTOs.add(convertToUserDTO(teacher.getUser()));
        }
        result.put("teachers", teacherDTOs);
        
        // Find users who want to learn this skill
        List<UserLearnSkill> learners = userLearnSkillRepository.findBySkill(
            skillService.getSkillById(skillId)
        );
        List<UserDTO> learnerDTOs = new ArrayList<>();
        for (UserLearnSkill learner : learners) {
            learnerDTOs.add(convertToUserDTO(learner.getUser()));
        }
        result.put("learners", learnerDTOs);
        
        return result;
    }

    // Helper method to get skill by ID (add this to SkillService)
    private Skill getSkillById(Long skillId) {
        // This should be in SkillService, but adding here for now
        return skillService.getSkillById(skillId);
    }
}