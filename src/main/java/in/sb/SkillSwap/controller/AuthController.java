package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.dto.AuthRequest;
import in.sb.SkillSwap.dto.AuthResponse;
import in.sb.SkillSwap.dto.RegisterRequest;
import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {  // Removed @CrossOrigin

    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse response = userService.register(registerRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        AuthResponse response = userService.login(authRequest);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        
        if (token != null && userService.validateToken(token)) {
            return ResponseEntity.ok(new AuthResponse(token, null, "Token is valid"));
        }
        
        return ResponseEntity.status(401).body(new AuthResponse(null, null, "Invalid token"));
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        
        if (token != null && userService.validateToken(token)) {
            var user = userService.getUserFromToken(token);
            return ResponseEntity.ok(new AuthResponse(token, user, "User retrieved successfully"));
        }
        
        return ResponseEntity.status(401).body(new AuthResponse(null, null, "Invalid token"));
    }
    
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}