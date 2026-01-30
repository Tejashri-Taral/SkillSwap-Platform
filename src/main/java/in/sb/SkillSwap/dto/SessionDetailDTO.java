package in.sb.SkillSwap.dto;

import in.sb.SkillSwap.model.SessionStatus;
import java.time.LocalDateTime;

public class SessionDetailDTO {
    private Long id;
    private UserDTO partner;
    private SkillDTO skillYouTeach;
    private SkillDTO skillYouLearn;
    private String title;
    private String description;
    private LocalDateTime scheduledDate;
    private Integer duration;
    private String meetingUrl;
    private String meetingPlatform;
    private String sessionNotes;
    private String sharedResources;
    private SessionStatus status;
    private Boolean youConfirmed;
    private Boolean partnerConfirmed;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors, getters and setters
    public SessionDetailDTO() {
    }

    // Getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public UserDTO getPartner() { return partner; }
    public void setPartner(UserDTO partner) { this.partner = partner; }
    
    public SkillDTO getSkillYouTeach() { return skillYouTeach; }
    public void setSkillYouTeach(SkillDTO skillYouTeach) { this.skillYouTeach = skillYouTeach; }
    
    public SkillDTO getSkillYouLearn() { return skillYouLearn; }
    public void setSkillYouLearn(SkillDTO skillYouLearn) { this.skillYouLearn = skillYouLearn; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }
    
    public String getMeetingPlatform() { return meetingPlatform; }
    public void setMeetingPlatform(String meetingPlatform) { this.meetingPlatform = meetingPlatform; }
    
    public String getSessionNotes() { return sessionNotes; }
    public void setSessionNotes(String sessionNotes) { this.sessionNotes = sessionNotes; }
    
    public String getSharedResources() { return sharedResources; }
    public void setSharedResources(String sharedResources) { this.sharedResources = sharedResources; }
    
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    
    public Boolean getYouConfirmed() { return youConfirmed; }
    public void setYouConfirmed(Boolean youConfirmed) { this.youConfirmed = youConfirmed; }
    
    public Boolean getPartnerConfirmed() { return partnerConfirmed; }
    public void setPartnerConfirmed(Boolean partnerConfirmed) { this.partnerConfirmed = partnerConfirmed; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}