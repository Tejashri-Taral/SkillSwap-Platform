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

    // Main matching algorithm - Returns categorized matches
    public Map<String, List<MatchDTO>> findCategorizedMatchesForUser(Long userId) {
        try {
            User currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new AuthException("User not found"));

            List<Skill> currentUserTeachSkills = getTeachSkillsForUser(userId);
            List<Skill> currentUserLearnSkills = getLearnSkillsForUser(userId);

            List<User> allUsers = userRepository.findAll();
            
            // Create categories
            List<MatchDTO> perfectMatches = new ArrayList<>();
            List<MatchDTO> goodMatches = new ArrayList<>();
            List<MatchDTO> potentialMatches = new ArrayList<>();

            for (User otherUser : allUsers) {
                if (otherUser.getId().equals(userId)) continue;

                List<Skill> otherUserTeachSkills = getTeachSkillsForUser(otherUser.getId());
                List<Skill> otherUserLearnSkills = getLearnSkillsForUser(otherUser.getId());

                MatchScore matchScore = calculateMatchScore(
                        currentUserTeachSkills, currentUserLearnSkills,
                        otherUserTeachSkills, otherUserLearnSkills
                );

                if (matchScore.score > 0) {
                    MatchDTO matchDTO = new MatchDTO();
                    matchDTO.setUser(convertToUserDTO(otherUser));
                    matchDTO.setMatchScore(matchScore.score);

                    // CORRECT LOGIC WITH CLEAR FIELD NAMES:
                    // Skill YOU can teach THEM (You → Them)
                    Skill skillYouCanTeachThem = 
                        findCommonSkill(currentUserTeachSkills, otherUserLearnSkills);

                    // Skill THEY can teach YOU (They → You)  
                    Skill skillTheyCanTeachYou = 
                        findCommonSkill(otherUserTeachSkills, currentUserLearnSkills);

                    matchDTO.setSkillYouCanTeachThem(convertToSkillDTO(skillYouCanTeachThem));
                    matchDTO.setSkillTheyCanTeachYou(convertToSkillDTO(skillTheyCanTeachYou));

                    String description = generateMatchDescription(
                            skillYouCanTeachThem, skillTheyCanTeachYou,
                            matchScore.youTeachThemCount, matchScore.theyTeachYouCount
                    );
                    matchDTO.setMatchDescription(description);

                    // Categorize based on match type
                    if (matchScore.youTeachThemCount > 0 && matchScore.theyTeachYouCount > 0) {
                        // Perfect match: Both can teach each other (bidirectional swap)
                        perfectMatches.add(matchDTO);
                    } else if (matchScore.score >= 2) {
                        // Good match: Multiple skills in one direction
                        goodMatches.add(matchDTO);
                    } else {
                        // Potential match: Single skill match
                        potentialMatches.add(matchDTO);
                    }
                }
            }

            // Sort each category by match score (highest first)
            perfectMatches.sort((m1, m2) -> m2.getMatchScore().compareTo(m1.getMatchScore()));
            goodMatches.sort((m1, m2) -> m2.getMatchScore().compareTo(m1.getMatchScore()));
            potentialMatches.sort((m1, m2) -> m2.getMatchScore().compareTo(m1.getMatchScore()));

            // Return categorized matches
            Map<String, List<MatchDTO>> categorizedMatches = new LinkedHashMap<>();
            categorizedMatches.put("perfect", perfectMatches);
            categorizedMatches.put("good", goodMatches);
            categorizedMatches.put("potential", potentialMatches);

            return categorizedMatches;

        } catch (Exception e) {
            throw new AuthException("Error finding matches: " + e.getMessage(), e);
        }
    }

    // Original method for backward compatibility
    public List<MatchDTO> findMatchesForUser(Long userId) {
        try {
            User currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new AuthException("User not found"));

            List<Skill> currentUserTeachSkills = getTeachSkillsForUser(userId);
            List<Skill> currentUserLearnSkills = getLearnSkillsForUser(userId);

            List<User> allUsers = userRepository.findAll();
            List<MatchDTO> matches = new ArrayList<>();

            for (User otherUser : allUsers) {
                if (otherUser.getId().equals(userId)) continue;

                List<Skill> otherUserTeachSkills = getTeachSkillsForUser(otherUser.getId());
                List<Skill> otherUserLearnSkills = getLearnSkillsForUser(otherUser.getId());

                MatchScore matchScore = calculateMatchScore(
                        currentUserTeachSkills, currentUserLearnSkills,
                        otherUserTeachSkills, otherUserLearnSkills
                );

                if (matchScore.score > 0) {
                    MatchDTO matchDTO = new MatchDTO();
                    matchDTO.setUser(convertToUserDTO(otherUser));
                    matchDTO.setMatchScore(matchScore.score);

                    // CORRECT LOGIC WITH CLEAR FIELD NAMES:
                    // Skill YOU can teach THEM (You → Them)
                    Skill skillYouCanTeachThem = 
                        findCommonSkill(currentUserTeachSkills, otherUserLearnSkills);

                    // Skill THEY can teach YOU (They → You)  
                    Skill skillTheyCanTeachYou = 
                        findCommonSkill(otherUserTeachSkills, currentUserLearnSkills);

                    matchDTO.setSkillYouCanTeachThem(convertToSkillDTO(skillYouCanTeachThem));
                    matchDTO.setSkillTheyCanTeachYou(convertToSkillDTO(skillTheyCanTeachYou));

                    String description = generateMatchDescription(
                            skillYouCanTeachThem, skillTheyCanTeachYou,
                            matchScore.youTeachThemCount, matchScore.theyTeachYouCount
                    );
                    matchDTO.setMatchDescription(description);

                    matches.add(matchDTO);
                }
            }

            // Sort by match score (highest first)
            matches.sort((m1, m2) -> m2.getMatchScore().compareTo(m1.getMatchScore()));
            return matches;

        } catch (Exception e) {
            throw new AuthException("Error finding matches: " + e.getMessage(), e);
        }
    }

    // Calculate match score between two users
    private MatchScore calculateMatchScore(
            List<Skill> userATeach, List<Skill> userALearn,
            List<Skill> userBTeach, List<Skill> userBLearn) {

        int youTeachThemCount = 0;   // User A can teach what User B wants to learn
        int theyTeachYouCount = 0;   // User B can teach what User A wants to learn

        // User A can teach what User B wants to learn (A.teach ∩ B.learn)
        for (Skill skillA : userATeach) {
            for (Skill skillB : userBLearn) {
                if (skillA.getId().equals(skillB.getId())) {
                    youTeachThemCount++;
                    break;
                }
            }
        }

        // User B can teach what User A wants to learn (B.teach ∩ A.learn)
        for (Skill skillB : userBTeach) {
            for (Skill skillA : userALearn) {
                if (skillB.getId().equals(skillA.getId())) {
                    theyTeachYouCount++;
                    break;
                }
            }
        }

        // Calculate total score - both types of matches are equally valuable
        int totalScore = youTeachThemCount + theyTeachYouCount;
        
        return new MatchScore(youTeachThemCount, theyTeachYouCount, totalScore);
    }

    // Helper class for match score with clear field names
    private static class MatchScore {
        int youTeachThemCount;    // How many skills you can teach them
        int theyTeachYouCount;    // How many skills they can teach you
        int score;
        
        MatchScore(int youTeachThemCount, int theyTeachYouCount, int score) {
            this.youTeachThemCount = youTeachThemCount;
            this.theyTeachYouCount = theyTeachYouCount;
            this.score = score;
        }
    }

    // Find common skill between two lists
    private Skill findCommonSkill(List<Skill> list1, List<Skill> list2) {
        if (list1 == null || list2 == null || list1.isEmpty() || list2.isEmpty()) {
            return null;
        }

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
    private String generateMatchDescription(Skill skillYouCanTeachThem, Skill skillTheyCanTeachYou,
                                           int youTeachThemCount, int theyTeachYouCount) {

        StringBuilder desc = new StringBuilder();

        if (skillYouCanTeachThem != null && skillTheyCanTeachYou != null) {
            desc.append("Perfect match! You can teach them ")
                .append(skillYouCanTeachThem.getName())
                .append(" and they can teach you ")
                .append(skillTheyCanTeachYou.getName())
                .append(".");
        } else if (skillYouCanTeachThem != null) {
            desc.append("You can teach them ")
                .append(skillYouCanTeachThem.getName())
                .append(".");
        } else if (skillTheyCanTeachYou != null) {
            desc.append("They can teach you ")
                .append(skillTheyCanTeachYou.getName())
                .append(".");
        }

        // Calculate additional matches beyond the first one
        int additionalMatches = (youTeachThemCount > 0 ? youTeachThemCount - 1 : 0) + 
                               (theyTeachYouCount > 0 ? theyTeachYouCount - 1 : 0);
        
        if (additionalMatches > 0) {
            desc.append(" Plus ").append(additionalMatches).append(" more matching skill");
            if (additionalMatches > 1) {
                desc.append("s");
            }
            desc.append("!");
        }

        return desc.toString();
    }

    // Convert User to UserDTO
    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBio(user.getBio());
        dto.setRating(user.getRating());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        return dto;
    }

    // Convert Skill to SkillDTO
    private SkillDTO convertToSkillDTO(Skill skill) {
        if (skill == null) return null;
        return new SkillDTO(
                skill.getId(),
                skill.getName(),
                skill.getDescription(),
                skill.getCategory()
        );
    }

    // Get users who can teach or want to learn a specific skill
    public Map<String, List<UserDTO>> findUsersBySkill(Long skillId) {
        Map<String, List<UserDTO>> result = new HashMap<>();

        Skill skill = skillService.getSkillById(skillId);

        // Find users who can teach this skill
        List<UserTeachSkill> teachers = userTeachSkillRepository.findBySkill(skill);
        List<UserDTO> teacherDTOs = new ArrayList<>();
        for (UserTeachSkill teacher : teachers) {
            teacherDTOs.add(convertToUserDTO(teacher.getUser()));
        }
        result.put("teachers", teacherDTOs);

        // Find users who want to learn this skill
        List<UserLearnSkill> learners = userLearnSkillRepository.findBySkill(skill);
        List<UserDTO> learnerDTOs = new ArrayList<>();
        for (UserLearnSkill learner : learners) {
            learnerDTOs.add(convertToUserDTO(learner.getUser()));
        }
        result.put("learners", learnerDTOs);

        return result;
    }

    // Helper method to get teach skills for a user
    private List<Skill> getTeachSkillsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        List<UserTeachSkill> teachSkillRelations = userTeachSkillRepository.findByUser(user);
        List<Skill> skills = new ArrayList<>();

        for (UserTeachSkill relation : teachSkillRelations) {
            skills.add(relation.getSkill());
        }
        return skills;
    }

    // Helper method to get learn skills for a user
    private List<Skill> getLearnSkillsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        List<UserLearnSkill> learnSkillRelations = userLearnSkillRepository.findByUser(user);
        List<Skill> skills = new ArrayList<>();

        for (UserLearnSkill relation : learnSkillRelations) {
            skills.add(relation.getSkill());
        }
        return skills;
    }
}