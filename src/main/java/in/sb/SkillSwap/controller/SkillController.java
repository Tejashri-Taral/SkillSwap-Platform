package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.dto.SkillDTO;
import in.sb.SkillSwap.dto.UserSkillRequest;
import in.sb.SkillSwap.dto.UserSkillResponse;
import in.sb.SkillSwap.service.SkillService;
import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @Autowired
    private UserService userService;

    // Public endpoints - don't require authentication
    @GetMapping
    public ResponseEntity<List<SkillDTO>> getAllSkills() {
        List<SkillDTO> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SkillDTO>> searchSkills(@RequestParam String query) {
        List<SkillDTO> skills = skillService.searchSkills(query);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SkillDTO>> getSkillsByCategory(@PathVariable String category) {
        List<SkillDTO> skills = skillService.getSkillsByCategory(category);
        return ResponseEntity.ok(skills);
    }

    // User-specific endpoints - require authentication
    @PostMapping("/teach")
    public ResponseEntity<UserSkillResponse> addTeachSkill(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserSkillRequest request) {
        Long userId = getUserIdFromToken(authHeader);
        UserSkillResponse response = skillService.addTeachSkill(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/teach")
    public ResponseEntity<List<UserSkillResponse>> getTeachSkills(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<UserSkillResponse> skills = skillService.getTeachSkills(userId);
        return ResponseEntity.ok(skills);
    }

    @DeleteMapping("/teach/{skillId}")
    public ResponseEntity<Void> removeTeachSkill(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long skillId) {
        Long userId = getUserIdFromToken(authHeader);
        skillService.removeTeachSkill(userId, skillId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/learn")
    public ResponseEntity<UserSkillResponse> addLearnSkill(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserSkillRequest request) {
        Long userId = getUserIdFromToken(authHeader);
        UserSkillResponse response = skillService.addLearnSkill(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/learn")
    public ResponseEntity<List<UserSkillResponse>> getLearnSkills(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<UserSkillResponse> skills = skillService.getLearnSkills(userId);
        return ResponseEntity.ok(skills);
    }

    @DeleteMapping("/learn/{skillId}")
    public ResponseEntity<Void> removeLearnSkill(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long skillId) {
        Long userId = getUserIdFromToken(authHeader);
        skillService.removeLearnSkill(userId, skillId);
        return ResponseEntity.ok().build();
    }

    // Helper method to extract user ID from token
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