package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {  // Removed @CrossOrigin

    @Autowired
    private UserService userService;

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from SkillSwap Backend!");
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("SkillSwap Backend is running!");
    }
    
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint(@RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        
        if (token != null && userService.validateToken(token)) {
            var user = userService.getUserFromToken(token);
            return ResponseEntity.ok("Hello " + user.getFullName() + "! This is a protected endpoint.");
        }
        
        return ResponseEntity.status(401).body("Unauthorized - Invalid or missing token");
    }
    
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}