package in.sb.SkillSwap.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_tracking")
public class ProgressTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column
    private Boolean taughtConfirmed = false;

    @Column
    private Boolean learnedConfirmed = false;

    @Column
    private Integer ratingGiven; // 1-5

    @Column
    private String feedback;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Default constructor
    public ProgressTracking() {
    }

    // Constructor
    public ProgressTracking(Session session, User user, Skill skill) {
        this.session = session;
        this.user = user;
        this.skill = skill;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public Boolean getTaughtConfirmed() {
        return taughtConfirmed;
    }

    public void setTaughtConfirmed(Boolean taughtConfirmed) {
        this.taughtConfirmed = taughtConfirmed;
        if (taughtConfirmed || learnedConfirmed) {
            this.confirmedAt = LocalDateTime.now();
        }
    }

    public Boolean getLearnedConfirmed() {
        return learnedConfirmed;
    }

    public void setLearnedConfirmed(Boolean learnedConfirmed) {
        this.learnedConfirmed = learnedConfirmed;
        if (taughtConfirmed || learnedConfirmed) {
            this.confirmedAt = LocalDateTime.now();
        }
    }

    public Integer getRatingGiven() {
        return ratingGiven;
    }

    public void setRatingGiven(Integer ratingGiven) {
        this.ratingGiven = ratingGiven;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Helper method to check if both confirmed
    public boolean isBothConfirmed() {
        return taughtConfirmed && learnedConfirmed;
    }
}