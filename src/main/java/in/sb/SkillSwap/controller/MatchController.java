package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.dto.MatchDTO;
import in.sb.SkillSwap.service.MatchService;
import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private UserService userService;

    // Original endpoint - returns all matches sorted by score
    @GetMapping
    public ResponseEntity<List<MatchDTO>> getMatches(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<MatchDTO> matches = matchService.findMatchesForUser(userId);
        return ResponseEntity.ok(matches);
    }

    // New endpoint - returns categorized matches (perfect, good, potential)
    @GetMapping("/categorized")
    public ResponseEntity<Map<String, List<MatchDTO>>> getCategorizedMatches(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        Map<String, List<MatchDTO>> categorizedMatches = matchService.findCategorizedMatchesForUser(userId);
        return ResponseEntity.ok(categorizedMatches);
    }

    @GetMapping("/skill/{skillId}")
    public ResponseEntity<Map<String, List<in.sb.SkillSwap.dto.UserDTO>>> getUsersBySkill(
            @PathVariable Long skillId) {
        Map<String, List<in.sb.SkillSwap.dto.UserDTO>> users = matchService.findUsersBySkill(skillId);
        return ResponseEntity.ok(users);
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