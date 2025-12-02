package in.sb.SkillSwap.dto;

public class MatchDTO {
    private UserDTO user;
    private Integer matchScore;
    private SkillDTO mutualTeachSkill; // Skill they can teach you
    private SkillDTO mutualLearnSkill; // Skill you can teach them
    private String matchDescription;

    // Default constructor
    public MatchDTO() {
    }

    // Constructor
    public MatchDTO(UserDTO user, Integer matchScore, SkillDTO mutualTeachSkill, SkillDTO mutualLearnSkill, String matchDescription) {
        this.user = user;
        this.matchScore = matchScore;
        this.mutualTeachSkill = mutualTeachSkill;
        this.mutualLearnSkill = mutualLearnSkill;
        this.matchDescription = matchDescription;
    }

    // Getters and Setters
    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public SkillDTO getMutualTeachSkill() {
        return mutualTeachSkill;
    }

    public void setMutualTeachSkill(SkillDTO mutualTeachSkill) {
        this.mutualTeachSkill = mutualTeachSkill;
    }

    public SkillDTO getMutualLearnSkill() {
        return mutualLearnSkill;
    }

    public void setMutualLearnSkill(SkillDTO mutualLearnSkill) {
        this.mutualLearnSkill = mutualLearnSkill;
    }

    public String getMatchDescription() {
        return matchDescription;
    }

    public void setMatchDescription(String matchDescription) {
        this.matchDescription = matchDescription;
    }
}