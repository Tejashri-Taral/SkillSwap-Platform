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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    // Create session from accepted swap request
    @Transactional
    public SessionDTO createSessionFromSwapRequest(SwapRequest swapRequest) {
        Session session = new Session();
        session.setSwapRequest(swapRequest);
        session.setTitle("Skill Swap: " + swapRequest.getTeachSkill().getName() + 
                        " ↔ " + swapRequest.getLearnSkill().getName());
        session.setDescription("Skill swap session between " + 
                             swapRequest.getSender().getFullName() + " and " + 
                             swapRequest.getReceiver().getFullName());
        session.setStatus(SessionStatus.CREATED);

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

    // Add meeting URL to session
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

    // Get sessions for user
    public List<SessionDTO> getSessionsForUser(Long userId) {
        User user = userService.getUserById(userId);
        List<Session> sessions = sessionRepository.findByUser(user);
        return convertToDTOList(sessions);
    }

    // Get session by ID
    public SessionDTO getSessionById(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        verifyUserInSession(session, userId);

        return convertToDTO(session);
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
        // We'll convert swap request later if needed
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
}