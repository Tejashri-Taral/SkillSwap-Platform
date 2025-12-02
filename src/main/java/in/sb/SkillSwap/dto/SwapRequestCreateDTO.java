package in.sb.SkillSwap.dto;

public class SwapRequestCreateDTO {
    private Long receiverId;
    private Long teachSkillId; // Skill you will teach
    private Long learnSkillId; // Skill you want to learn
    private String message;

    // Default constructor
    public SwapRequestCreateDTO() {
    }

    // Constructor
    public SwapRequestCreateDTO(Long receiverId, Long teachSkillId, Long learnSkillId, String message) {
        this.receiverId = receiverId;
        this.teachSkillId = teachSkillId;
        this.learnSkillId = learnSkillId;
        this.message = message;
    }

    // Getters and Setters
    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public Long getTeachSkillId() {
        return teachSkillId;
    }

    public void setTeachSkillId(Long teachSkillId) {
        this.teachSkillId = teachSkillId;
    }

    public Long getLearnSkillId() {
        return learnSkillId;
    }

    public void setLearnSkillId(Long learnSkillId) {
        this.learnSkillId = learnSkillId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}