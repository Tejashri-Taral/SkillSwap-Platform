package in.sb.SkillSwap.controller;

import in.sb.SkillSwap.dto.SwapRequestCreateDTO;
import in.sb.SkillSwap.dto.SwapRequestDTO;
import in.sb.SkillSwap.service.SwapRequestService;
import in.sb.SkillSwap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swap-requests")
public class SwapRequestController {

    @Autowired
    private SwapRequestService swapRequestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<SwapRequestDTO> createSwapRequest(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SwapRequestCreateDTO requestDTO) {
        Long userId = getUserIdFromToken(authHeader);
        SwapRequestDTO createdRequest = swapRequestService.createSwapRequest(userId, requestDTO);
        return ResponseEntity.ok(createdRequest);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<SwapRequestDTO>> getSentRequests(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<SwapRequestDTO> requests = swapRequestService.getSentRequests(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/received")
    public ResponseEntity<List<SwapRequestDTO>> getReceivedRequests(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<SwapRequestDTO> requests = swapRequestService.getReceivedRequests(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<SwapRequestDTO> getSwapRequestById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long requestId) {
        Long userId = getUserIdFromToken(authHeader);
        SwapRequestDTO request = swapRequestService.getSwapRequestById(requestId, userId);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<SwapRequestDTO> acceptSwapRequest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long requestId) {
        Long userId = getUserIdFromToken(authHeader);
        SwapRequestDTO request = swapRequestService.acceptSwapRequest(requestId, userId);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<SwapRequestDTO> rejectSwapRequest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long requestId) {
        Long userId = getUserIdFromToken(authHeader);
        SwapRequestDTO request = swapRequestService.rejectSwapRequest(requestId, userId);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<SwapRequestDTO> cancelSwapRequest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long requestId) {
        Long userId = getUserIdFromToken(authHeader);
        SwapRequestDTO request = swapRequestService.cancelSwapRequest(requestId, userId);
        return ResponseEntity.ok(request);
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