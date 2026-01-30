package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.dto.SessionDTO;
import in.sb.SkillSwap.exception.AuthException;
import in.sb.SkillSwap.model.Session;
import in.sb.SkillSwap.model.SwapRequest;
import in.sb.SkillSwap.model.SwapRequestStatus;
import in.sb.SkillSwap.repository.SessionRepository;
import in.sb.SkillSwap.repository.SwapRequestRepository;
import in.sb.SkillSwap.service.SessionService;
import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private SessionRepository sessionRepository;

    // Get all sessions for user
    @GetMapping
    public ResponseEntity<List<SessionDTO>> getSessions(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<SessionDTO> sessions = sessionService.getSessionsForUser(userId);
        return ResponseEntity.ok(sessions);
    }

    // Get sessions categorized by status
    @GetMapping("/categorized")
    public ResponseEntity<Map<String, List<SessionDTO>>> getCategorizedSessions(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        Map<String, List<SessionDTO>> sessions = sessionService.getSessionsByStatus(userId);
        return ResponseEntity.ok(sessions);
    }

    // Get session by ID
    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDTO> getSessionById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.getSessionById(sessionId, userId);
        return ResponseEntity.ok(session);
    }

    // Schedule a session
    @PutMapping("/{sessionId}/schedule")
    public ResponseEntity<SessionDTO> scheduleSession(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime scheduledDate,
            @RequestParam Integer duration) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.scheduleSession(sessionId, scheduledDate, duration, userId);
        return ResponseEntity.ok(session);
    }

    // Start a session
    @PutMapping("/{sessionId}/start")
    public ResponseEntity<SessionDTO> startSession(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.startSession(sessionId, userId);
        return ResponseEntity.ok(session);
    }

    // Complete a session
    @PutMapping("/{sessionId}/complete")
    public ResponseEntity<SessionDTO> completeSession(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.completeSession(sessionId, userId);
        return ResponseEntity.ok(session);
    }

    // Update meeting URL
    @PutMapping("/{sessionId}/meeting-url")
    public ResponseEntity<SessionDTO> addMeetingUrl(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId,
            @RequestParam String meetingUrl,
            @RequestParam String meetingPlatform) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.addMeetingUrl(sessionId, meetingUrl, meetingPlatform, userId);
        return ResponseEntity.ok(session);
    }

    // Update session notes
    @PutMapping("/{sessionId}/notes")
    public ResponseEntity<SessionDTO> updateSessionNotes(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId,
            @RequestParam String notes) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.updateSessionNotes(sessionId, notes, userId);
        return ResponseEntity.ok(session);
    }

    // Add shared resources
    @PutMapping("/{sessionId}/resources")
    public ResponseEntity<SessionDTO> addSharedResources(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId,
            @RequestParam String resources) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.addSharedResources(sessionId, resources, userId);
        return ResponseEntity.ok(session);
    }

    // Create session from accepted swap request
    @PostMapping("/create-from-request/{requestId}")
    public ResponseEntity<SessionDTO> createSessionFromRequest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long requestId) {
        Long userId = getUserIdFromToken(authHeader);

        try {
            // Fetch the swap request
            SwapRequest swapRequest = swapRequestRepository.findById(requestId)
                    .orElseThrow(() -> new AuthException("Swap request not found"));

            // Check if user is sender or receiver
            if (!swapRequest.getSender().getId().equals(userId) &&
                !swapRequest.getReceiver().getId().equals(userId)) {
                throw new AuthException("You are not authorized to create session from this request");
            }

            // Check status
            if (swapRequest.getStatus() != SwapRequestStatus.ACCEPTED) {
                throw new AuthException("Swap request must be accepted to create session");
            }

            // Check if session already exists
            List<Session> existingSessions = sessionRepository.findBySwapRequest(swapRequest);
            if (!existingSessions.isEmpty()) {
                // Return existing session
                SessionDTO existingSession = sessionService.getSessionById(existingSessions.get(0).getId(), userId);
                return ResponseEntity.ok(existingSession);
            }

            // Create session
            SessionDTO session = sessionService.createSessionFromSwapRequest(swapRequest);

            return ResponseEntity.ok(session);

        } catch (AuthException e) {
            throw e;
        } catch (Exception e) {
            throw new AuthException("Failed to create session: " + e.getMessage());
        }
    }

    // Get Jitsi meeting link for session
    @GetMapping("/{sessionId}/meeting-link")
    public ResponseEntity<Map<String, String>> getMeetingLink(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new AuthException("Session not found"));

        // Verify user is part of the session
        SwapRequest swapRequest = session.getSwapRequest();
        if (!swapRequest.getSender().getId().equals(userId) &&
            !swapRequest.getReceiver().getId().equals(userId)) {
            throw new AuthException("You are not authorized to access this session");
        }

        Map<String, String> response = new HashMap<>();
        response.put("meetingUrl", session.getMeetingUrl());
        response.put("meetingPlatform", session.getMeetingPlatform());
        response.put("title", session.getTitle());
        response.put("sessionId", sessionId.toString());

        return ResponseEntity.ok(response);
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = extractToken(authHeader);
        if (token == null || !userService.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        return userService.getUserFromToken(token).getId();
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @GetMapping("/{sessionId}/meeting-details")
    public ResponseEntity<Map<String, Object>> getMeetingDetails(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        Map<String, Object> meetingDetails = sessionService.getMeetingDetails(sessionId, userId);
        return ResponseEntity.ok(meetingDetails);
    }
    
 // Simple completion endpoint
    @PutMapping("/{sessionId}/mark-completed")
    public ResponseEntity<SessionDTO> markSessionAsCompleted(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.markAsCompleted(sessionId, userId);
        return ResponseEntity.ok(session);
    }
}