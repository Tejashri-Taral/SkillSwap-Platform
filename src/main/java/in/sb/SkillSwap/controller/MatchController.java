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

    @GetMapping
    public ResponseEntity<List<MatchDTO>> getMatches(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<MatchDTO> matches = matchService.findMatchesForUser(userId);
        return ResponseEntity.ok(matches);
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