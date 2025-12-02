package in.sb.SkillSwap.service;

import in.sb.SkillSwap.dto.AuthRequest;
import in.sb.SkillSwap.dto.AuthResponse;
import in.sb.SkillSwap.dto.RegisterRequest;
import in.sb.SkillSwap.exception.AuthException;
import in.sb.SkillSwap.model.User;
import in.sb.SkillSwap.repository.UserRepository;
import in.sb.SkillSwap.util.JwtUtil;
import in.sb.SkillSwap.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordUtil passwordUtil;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new AuthException("User with this email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordUtil.hashPassword(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Generate token
        String token = jwtUtil.generateToken(savedUser);
        
        // Return response
        return new AuthResponse(token, savedUser, "Registration successful");
    }
    
    public AuthResponse login(AuthRequest authRequest) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(authRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new AuthException("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Verify password
        if (!passwordUtil.verifyPassword(authRequest.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }
        
        // Generate token
        String token = jwtUtil.generateToken(user);
        
        // Return response
        return new AuthResponse(token, user, "Login successful");
    }
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));
    }
    
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
    
    public User getUserFromToken(String token) {
        if (!validateToken(token)) {
            throw new AuthException("Invalid token");
        }
        
        String email = jwtUtil.extractEmail(token);
        return getUserByEmail(email);
    }
 // Add these methods to UserService class

    public boolean hasTeachSkill(Long userId, Long skillId) {
        User user = getUserById(userId);
        // This should check the user_teach_skills table
        // For now, return true - we'll implement this properly later
        return true;
    }

    public boolean hasLearnSkill(Long userId, Long skillId) {
        User user = getUserById(userId);
        // This should check the user_learn_skills table
        // For now, return true - we'll implement this properly later
        return true;
    }
}