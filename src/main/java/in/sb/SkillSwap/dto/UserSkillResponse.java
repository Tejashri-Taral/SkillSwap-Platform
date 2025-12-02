package in.sb.SkillSwap.dto;

public class UserSkillResponse {
    private Long id;
    private SkillDTO skill;
    private Integer level;
    private String goal;
    private String createdAt;

    // Default constructor
    public UserSkillResponse() {
    }

    // Constructor
    public UserSkillResponse(Long id, SkillDTO skill, Integer level, String goal, String createdAt) {
        this.id = id;
        this.skill = skill;
        this.level = level;
        this.goal = goal;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SkillDTO getSkill() {
        return skill;
    }

    public void setSkill(SkillDTO skill) {
        this.skill = skill;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}