package in.sb.SkillSwap.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "teach_skill_id")
    private Skill teachSkill; // What sender will teach

    @ManyToOne
    @JoinColumn(name = "learn_skill_id")
    private Skill learnSkill; // What sender wants to learn

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwapRequestStatus status = SwapRequestStatus.PENDING;

    @Column
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Default constructor
    public SwapRequest() {
    }

    // Constructor
    public SwapRequest(User sender, User receiver, Skill teachSkill, Skill learnSkill, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.teachSkill = teachSkill;
        this.learnSkill = learnSkill;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public Skill getTeachSkill() {
        return teachSkill;
    }

    public void setTeachSkill(Skill teachSkill) {
        this.teachSkill = teachSkill;
    }

    public Skill getLearnSkill() {
        return learnSkill;
    }

    public void setLearnSkill(Skill learnSkill) {
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