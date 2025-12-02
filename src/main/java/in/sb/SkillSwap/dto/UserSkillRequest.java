package in.sb.SkillSwap.dto;

public class UserSkillRequest {
    private String skillName;
    private String category;
    private String description;
    private Integer level; // For proficiency or current level
    private String goal; // For learning goal or teaching experience

    // Default constructor
    public UserSkillRequest() {
    }

    // Constructor
    public UserSkillRequest(String skillName, String category, Integer level, String goal) {
        this.skillName = skillName;
        this.category = category;
        this.level = level;
        this.goal = goal;
    }

    // Getters and Setters
    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}