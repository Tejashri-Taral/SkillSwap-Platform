package in.sb.SkillSwap.service;

import in.sb.SkillSwap.dto.SessionDTO;
import in.sb.SkillSwap.exception.AuthException;
import in.sb.SkillSwap.model.*;
import in.sb.SkillSwap.repository.ProgressTrackingRepository;
import in.sb.SkillSwap.repository.SessionRepository;
import in.sb.SkillSwap.repository.SwapRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.sb.SkillSwap.repository.UserRepository; 
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;  

    // Generate Jitsi meeting URL
    private String generateJitsiMeetingUrl() {
        String meetingId = UUID.randomUUID().toString().substring(0, 8);
        return "https://meet.jit.si/SkillSwap-" + meetingId;
    }

    // Create session from accepted swap request with Jitsi link
    @Transactional
    public SessionDTO createSessionFromSwapRequest(SwapRequest swapRequest) {
        // Check if session already exists for this swap request
        List<Session> existingSessions = sessionRepository.findBySwapRequest(swapRequest);
        if (!existingSessions.isEmpty()) {
            throw new AuthException("Session already exists for this swap request");
        }

        Session session = new Session();
        session.setSwapRequest(swapRequest);
        session.setTitle("Skill Swap: " + swapRequest.getTeachSkill().getName() + 
                        " ↔ " + swapRequest.getLearnSkill().getName());
        session.setDescription("Skill swap session between " + 
                             swapRequest.getSender().getFullName() + " and " + 
                             swapRequest.getReceiver().getFullName());
        session.setStatus(SessionStatus.CREATED);
        
        // Generate Jitsi meeting link
        String jitsiUrl = generateJitsiMeetingUrl();
        session.setMeetingUrl(jitsiUrl);
        session.setMeetingPlatform("JITSI");

        Session savedSession = sessionRepository.save(session);

        // Create progress tracking entries for both users
        createProgressTrackingEntries(savedSession);

        return convertToDTO(savedSession);
    }

    // Create progress tracking entries
    private void createProgressTrackingEntries(Session session) {
        SwapRequest swapRequest = session.getSwapRequest();
        
        // For sender: tracking what they teach
        ProgressTracking senderTeaching = new ProgressTracking(
            session, 
            swapRequest.getSender(), 
            swapRequest.getTeachSkill()
        );
        progressTrackingRepository.save(senderTeaching);
        
        // For sender: tracking what they learn
        ProgressTracking senderLearning = new ProgressTracking(
            session, 
            swapRequest.getSender(), 
            swapRequest.getLearnSkill()
        );
        progressTrackingRepository.save(senderLearning);
        
        // For receiver: tracking what they teach
        ProgressTracking receiverTeaching = new ProgressTracking(
            session, 
            swapRequest.getReceiver(), 
            swapRequest.getLearnSkill()
        );
        progressTrackingRepository.save(receiverTeaching);
        
        // For receiver: tracking what they learn
        ProgressTracking receiverLearning = new ProgressTracking(
            session, 
            swapRequest.getReceiver(), 
            swapRequest.getTeachSkill()
        );
        progressTrackingRepository.save(receiverLearning);
    }

    // Schedule a session
    @Transactional
    public SessionDTO scheduleSession(Long sessionId, LocalDateTime scheduledDate, 
                                     Integer duration, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        session.setScheduledDate(scheduledDate);
        session.setDuration(duration);
        session.setStatus(SessionStatus.SCHEDULED);
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Start a session
    @Transactional
    public SessionDTO startSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        session.setStatus(SessionStatus.IN_PROGRESS);
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Add meeting URL to session (custom URL if needed)
    @Transactional
    public SessionDTO addMeetingUrl(Long sessionId, String meetingUrl, 
                                   String meetingPlatform, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        session.setMeetingUrl(meetingUrl);
        session.setMeetingPlatform(meetingPlatform);
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Update session notes
    @Transactional
    public SessionDTO updateSessionNotes(Long sessionId, String notes, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        session.setSessionNotes(notes);
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Add shared resources
    @Transactional
    public SessionDTO addSharedResources(Long sessionId, String resources, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        session.setSharedResources(resources);
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Complete a session (both users need to confirm)
    @Transactional
    public SessionDTO completeSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        // Check if both users have confirmed completion
        boolean bothConfirmed = checkBothUsersConfirmed(session, userId);
        
        if (bothConfirmed) {
            // Both users have confirmed, mark session as completed
            session.setStatus(SessionStatus.COMPLETED);
            session.setCompletedAt(LocalDateTime.now());
            
            // Update user ratings based on feedback
            updateUserRatings(session);
        } else {
            // First user confirming, update their progress tracking
            updateUserConfirmation(session, userId);
        }
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Check if both users have confirmed completion
    private boolean checkBothUsersConfirmed(Session session, Long currentUserId) {
        SwapRequest swapRequest = session.getSwapRequest();
        Long senderId = swapRequest.getSender().getId();
        Long receiverId = swapRequest.getReceiver().getId();
        
        // Get progress tracking for both users
        List<ProgressTracking> senderTrackings = progressTrackingRepository.findByUser(swapRequest.getSender());
        List<ProgressTracking> receiverTrackings = progressTrackingRepository.findByUser(swapRequest.getReceiver());
        
        boolean senderConfirmed = false;
        boolean receiverConfirmed = false;
        
        // Check if sender has confirmed
        for (ProgressTracking tracking : senderTrackings) {
            if (tracking.getSession().getId().equals(session.getId()) && 
                tracking.isBothConfirmed()) {
                senderConfirmed = true;
                break;
            }
        }
        
        // Check if receiver has confirmed
        for (ProgressTracking tracking : receiverTrackings) {
            if (tracking.getSession().getId().equals(session.getId()) && 
                tracking.isBothConfirmed()) {
                receiverConfirmed = true;
                break;
            }
        }
        
        return senderConfirmed && receiverConfirmed;
    }

    // Update user confirmation in progress tracking
    private void updateUserConfirmation(Session session, Long userId) {
        SwapRequest swapRequest = session.getSwapRequest();
        User user = userService.getUserById(userId);
        
        // Get all progress trackings for this user and session
        List<ProgressTracking> userTrackings = progressTrackingRepository.findByUser(user);
        
        for (ProgressTracking tracking : userTrackings) {
            if (tracking.getSession().getId().equals(session.getId())) {
                // Determine if this tracking is for teaching or learning
                Skill skill = tracking.getSkill();
                
                if (userId.equals(swapRequest.getSender().getId())) {
                    // User is sender
                    if (skill.getId().equals(swapRequest.getTeachSkill().getId())) {
                        tracking.setTaughtConfirmed(true);
                    } else if (skill.getId().equals(swapRequest.getLearnSkill().getId())) {
                        tracking.setLearnedConfirmed(true);
                    }
                } else if (userId.equals(swapRequest.getReceiver().getId())) {
                    // User is receiver
                    if (skill.getId().equals(swapRequest.getLearnSkill().getId())) {
                        tracking.setTaughtConfirmed(true);
                    } else if (skill.getId().equals(swapRequest.getTeachSkill().getId())) {
                        tracking.setLearnedConfirmed(true);
                    }
                }
                
                progressTrackingRepository.save(tracking);
            }
        }
    }

    // Update user ratings based on session feedback
    private void updateUserRatings(Session session) {
        SwapRequest swapRequest = session.getSwapRequest();
        
        // Get all progress trackings for this session
        List<ProgressTracking> trackings = progressTrackingRepository.findBySession(session);
        
        Map<Long, List<Integer>> userRatings = new HashMap<>();
        
        // Collect all ratings
        for (ProgressTracking tracking : trackings) {
            if (tracking.getRatingGiven() != null) {
                Long userId = tracking.getUser().getId();
                userRatings.putIfAbsent(userId, new ArrayList<>());
                userRatings.get(userId).add(tracking.getRatingGiven());
            }
        }
        
        // Update user ratings
        for (Map.Entry<Long, List<Integer>> entry : userRatings.entrySet()) {
            Long userId = entry.getKey();
            List<Integer> ratings = entry.getValue();
            
            if (!ratings.isEmpty()) {
                // Get user from repository
                Optional<User> userOptional = userRepository.findById(userId);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    double average = ratings.stream().mapToInt(Integer::intValue).average().orElse(0.0);
                    
                    // Update user's overall rating
                    if (user.getRating() == null || user.getRating() == 0.0) {
                        user.setRating(average);
                    } else {
                        // Weighted average (70% old rating, 30% new rating)
                        double newRating = (user.getRating() * 0.7) + (average * 0.3);
                        user.setRating(Math.round(newRating * 10.0) / 10.0); // Round to 1 decimal
                    }
                    
                    userRepository.save(user);
                }
            }
        }
    }

    // Get sessions for user with details
    public List<SessionDTO> getSessionsForUser(Long userId) {
        User user = userService.getUserById(userId);
        List<Session> sessions = sessionRepository.findByUser(user);
        return convertToDTOList(sessions);
    }

    // Get sessions categorized by status
    public Map<String, List<SessionDTO>> getSessionsByStatus(Long userId) {
        User user = userService.getUserById(userId);
        List<Session> allSessions = sessionRepository.findByUser(user);
        
        List<SessionDTO> upcomingSessions = new ArrayList<>();
        List<SessionDTO> inProgressSessions = new ArrayList<>();
        List<SessionDTO> completedSessions = new ArrayList<>();
        List<SessionDTO> createdSessions = new ArrayList<>();
        
        for (Session session : allSessions) {
            SessionDTO dto = convertToDTO(session);
            
            switch (session.getStatus()) {
                case CREATED:
                    createdSessions.add(dto);
                    break;
                case SCHEDULED:
                    upcomingSessions.add(dto);
                    break;
                case IN_PROGRESS:
                    inProgressSessions.add(dto);
                    break;
                case COMPLETED:
                    completedSessions.add(dto);
                    break;
                case CANCELLED:
                    // Skip cancelled sessions
                    break;
            }
        }
        
        // Sort upcoming sessions by date
        upcomingSessions.sort(Comparator.comparing(SessionDTO::getScheduledDate));
        // Sort completed sessions by completion date (most recent first)
        completedSessions.sort(Comparator.comparing(SessionDTO::getUpdatedAt).reversed());
        
        Map<String, List<SessionDTO>> categorized = new HashMap<>();
        categorized.put("created", createdSessions);
        categorized.put("upcoming", upcomingSessions);
        categorized.put("inProgress", inProgressSessions);
        categorized.put("completed", completedSessions);
        
        return categorized;
    }

    // Get session by ID with full details
    public SessionDTO getSessionById(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        return convertToDetailedDTO(session, userId);
    }

    // Get session with detailed information
    private SessionDTO convertToDetailedDTO(Session session, Long currentUserId) {
        SessionDTO dto = convertToDTO(session);
        
        SwapRequest swapRequest = session.getSwapRequest();
        
        // Add partner information
        User partner = null;
        if (currentUserId.equals(swapRequest.getSender().getId())) {
            partner = swapRequest.getReceiver();
        } else {
            partner = swapRequest.getSender();
        }
        
        // Add skill exchange details
        String skillExchange = "";
        if (currentUserId.equals(swapRequest.getSender().getId())) {
            skillExchange = "You teach: " + swapRequest.getTeachSkill().getName() + 
                          " | You learn: " + swapRequest.getLearnSkill().getName();
        } else {
            skillExchange = "You teach: " + swapRequest.getLearnSkill().getName() + 
                          " | You learn: " + swapRequest.getTeachSkill().getName();
        }
        
        dto.setDescription(dto.getDescription() + "\n\n" + skillExchange);
        
        // Add completion status
        boolean currentUserConfirmed = false;
        boolean partnerConfirmed = false;
        
        List<ProgressTracking> currentUserTrackings = progressTrackingRepository.findByUser(
            userService.getUserById(currentUserId)
        );
        List<ProgressTracking> partnerTrackings = progressTrackingRepository.findByUser(partner);
        
        for (ProgressTracking tracking : currentUserTrackings) {
            if (tracking.getSession().getId().equals(session.getId()) && 
                tracking.isBothConfirmed()) {
                currentUserConfirmed = true;
                break;
            }
        }
        
        for (ProgressTracking tracking : partnerTrackings) {
            if (tracking.getSession().getId().equals(session.getId()) && 
                tracking.isBothConfirmed()) {
                partnerConfirmed = true;
                break;
            }
        }
        
        // Add confirmation status to description
        String confirmationStatus = "\n\nCompletion Status: ";
        if (session.getStatus() == SessionStatus.COMPLETED) {
            confirmationStatus += "✓ Session Completed on " + 
                (session.getCompletedAt() != null ? 
                 session.getCompletedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : 
                 "Unknown date");
        } else {
            confirmationStatus += "Your confirmation: " + (currentUserConfirmed ? "✓" : "⏳") + 
                                " | Partner's confirmation: " + (partnerConfirmed ? "✓" : "⏳");
        }
        
        dto.setDescription(dto.getDescription() + confirmationStatus);
        
        return dto;
    }

    // Verify user is part of the session
    private void verifyUserInSession(Session session, Long userId) {
        SwapRequest swapRequest = session.getSwapRequest();
        if (!swapRequest.getSender().getId().equals(userId) && 
            !swapRequest.getReceiver().getId().equals(userId)) {
            throw new AuthException("You are not authorized to access this session");
        }
    }

    // Helper methods for conversion
    private SessionDTO convertToDTO(Session session) {
        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setDescription(session.getDescription());
        dto.setScheduledDate(session.getScheduledDate());
        dto.setDuration(session.getDuration());
        dto.setMeetingUrl(session.getMeetingUrl());
        dto.setMeetingPlatform(session.getMeetingPlatform());
        dto.setSessionNotes(session.getSessionNotes());
        dto.setSharedResources(session.getSharedResources());
        dto.setStatus(session.getStatus());
        dto.setCreatedAt(session.getCreatedAt());
        dto.setUpdatedAt(session.getUpdatedAt());
        return dto;
    }

    private List<SessionDTO> convertToDTOList(List<Session> sessions) {
        List<SessionDTO> dtos = new ArrayList<>();
        for (Session session : sessions) {
            dtos.add(convertToDTO(session));
        }
        return dtos;
    }
    
 // Add this method to SessionService.java
    public Map<String, Object> getMeetingDetails(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        // Get partner info
        SwapRequest swapRequest = session.getSwapRequest();
        User partner = null;
        String skillYouTeach = "";
        String skillYouLearn = "";
        
        if (userId.equals(swapRequest.getSender().getId())) {
            partner = swapRequest.getReceiver();
            skillYouTeach = swapRequest.getTeachSkill().getName();
            skillYouLearn = swapRequest.getLearnSkill().getName();
        } else {
            partner = swapRequest.getSender();
            skillYouTeach = swapRequest.getLearnSkill().getName();
            skillYouLearn = swapRequest.getTeachSkill().getName();
        }

        Map<String, Object> meetingDetails = new HashMap<>();
        meetingDetails.put("sessionId", session.getId());
        meetingDetails.put("title", session.getTitle());
        meetingDetails.put("meetingUrl", session.getMeetingUrl());
        meetingDetails.put("meetingPlatform", session.getMeetingPlatform());
        meetingDetails.put("status", session.getStatus().toString());
        meetingDetails.put("partnerName", partner.getFullName());
        meetingDetails.put("skillYouTeach", skillYouTeach);
        meetingDetails.put("skillYouLearn", skillYouLearn);
        meetingDetails.put("scheduledDate", session.getScheduledDate());
        meetingDetails.put("duration", session.getDuration());
        
        // Add instructions for Jitsi
        if ("JITSI".equalsIgnoreCase(session.getMeetingPlatform())) {
            meetingDetails.put("instructions", "Click the link to join the Jitsi meeting. " +
                    "Make sure to allow camera/microphone access when prompted.");
        }

        return meetingDetails;
    }
    
 // Add this method to SessionService.java (simple version)
    @Transactional
    public SessionDTO markAsCompleted(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        // Mark as completed
        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        
        // Update progress tracking for this user
        updateUserProgressTracking(session, userId);
        
        Session updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }

    // Helper method to update progress tracking
    private void updateUserProgressTracking(Session session, Long userId) {
        SwapRequest swapRequest = session.getSwapRequest();
        User user = userService.getUserById(userId);
        
        // Get all progress trackings for this user and session
        List<ProgressTracking> userTrackings = progressTrackingRepository.findByUser(user);
        
        for (ProgressTracking tracking : userTrackings) {
            if (tracking.getSession().getId().equals(session.getId())) {
                // Mark both taught and learned as confirmed for this user
                tracking.setTaughtConfirmed(true);
                tracking.setLearnedConfirmed(true);
                progressTrackingRepository.save(tracking);
            }
        }
    }
}