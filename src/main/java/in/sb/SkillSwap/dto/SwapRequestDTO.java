package in.sb.SkillSwap.dto;

import in.sb.SkillSwap.model.SwapRequestStatus;

import java.time.LocalDateTime;

public class SwapRequestDTO {
    private Long id;
    private UserDTO sender;
    private UserDTO receiver;
    private SkillDTO teachSkill;
    private SkillDTO learnSkill;
    private SwapRequestStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public SwapRequestDTO() {
    }

    // Constructor
    public SwapRequestDTO(Long id, UserDTO sender, UserDTO receiver, SkillDTO teachSkill, 
                         SkillDTO learnSkill, SwapRequestStatus status, String message, 
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.teachSkill = teachSkill;
        this.learnSkill = learnSkill;
        this.status = status;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDTO getSender() {
        return sender;
    }

    public void setSender(UserDTO sender) {
        this.sender = sender;
    }

    public UserDTO getReceiver() {
        return receiver;
    }

    public void setReceiver(UserDTO receiver) {
        this.receiver = receiver;
    }

    public SkillDTO getTeachSkill() {
        return teachSkill;
    }

    public void setTeachSkill(SkillDTO teachSkill) {
        this.teachSkill = teachSkill;
    }

    public SkillDTO getLearnSkill() {
        return learnSkill;
    }

    public void setLearnSkill(SkillDTO learnSkill) {
        this.learnSkill = learnSkill;
    }

    public SwapRequestStatus getStatus() {
        return status;
    }

    public void setStatus(SwapRequestStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}