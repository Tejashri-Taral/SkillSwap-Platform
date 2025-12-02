package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.dto.SessionDTO;
import in.sb.SkillSwap.service.SessionService;
import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<SessionDTO>> getSessions(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<SessionDTO> sessions = sessionService.getSessionsForUser(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDTO> getSessionById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.getSessionById(sessionId, userId);
        return ResponseEntity.ok(session);
    }

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

    @PutMapping("/{sessionId}/start")
    public ResponseEntity<SessionDTO> startSession(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.startSession(sessionId, userId);
        return ResponseEntity.ok(session);
    }

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

    @PutMapping("/{sessionId}/notes")
    public ResponseEntity<SessionDTO> updateSessionNotes(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId,
            @RequestParam String notes) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.updateSessionNotes(sessionId, notes, userId);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{sessionId}/resources")
    public ResponseEntity<SessionDTO> addSharedResources(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long sessionId,
            @RequestParam String resources) {
        Long userId = getUserIdFromToken(authHeader);
        SessionDTO session = sessionService.addSharedResources(sessionId, resources, userId);
        return ResponseEntity.ok(session);
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
}