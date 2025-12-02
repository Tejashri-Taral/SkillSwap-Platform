package in.sb.SkillSwap.service;

import in.sb.SkillSwap.dto.SwapRequestCreateDTO;
import in.sb.SkillSwap.dto.SwapRequestDTO;
import in.sb.SkillSwap.exception.AuthException;
import in.sb.SkillSwap.model.*;
import in.sb.SkillSwap.repository.SkillRepository;
import in.sb.SkillSwap.repository.SwapRequestRepository;
import in.sb.SkillSwap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class SwapRequestService {

    @Autowired
    private SwapRequestRepository swapRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    // Create a new swap request
    @Transactional
    public SwapRequestDTO createSwapRequest(Long senderId, SwapRequestCreateDTO requestDTO) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AuthException("Sender not found"));

        User receiver = userRepository.findById(requestDTO.getReceiverId())
                .orElseThrow(() -> new AuthException("Receiver not found"));

        // Check if request already exists
        if (swapRequestRepository.existsBySenderAndReceiverAndStatus(
                sender, receiver, SwapRequestStatus.PENDING)) {
            throw new AuthException("A pending request already exists with this user");
        }

        // Get skills
        Skill teachSkill = skillRepository.findById(requestDTO.getTeachSkillId())
                .orElseThrow(() -> new AuthException("Teach skill not found"));

        Skill learnSkill = skillRepository.findById(requestDTO.getLearnSkillId())
                .orElseThrow(() -> new AuthException("Learn skill not found"));

        // Verify sender actually has these skills
        if (!userService.hasTeachSkill(senderId, teachSkill.getId())) {
            throw new AuthException("You don't have this skill in your teach list");
        }

        // Verify receiver actually wants to learn this skill
        if (!userService.hasLearnSkill(receiver.getId(), learnSkill.getId())) {
            throw new AuthException("Receiver doesn't want to learn this skill");
        }

        // Create and save swap request
        SwapRequest swapRequest = new SwapRequest(
                sender, receiver, teachSkill, learnSkill, requestDTO.getMessage()
        );

        SwapRequest savedRequest = swapRequestRepository.save(swapRequest);
        return convertToDTO(savedRequest);
    }

    // Get swap requests sent by user
    public List<SwapRequestDTO> getSentRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        List<SwapRequest> requests = swapRequestRepository.findBySender(user);
        return convertToDTOList(requests);
    }

    // Get swap requests received by user
    public List<SwapRequestDTO> getReceivedRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        List<SwapRequest> requests = swapRequestRepository.findByReceiver(user);
        return convertToDTOList(requests);
    }

    // Accept a swap request
    @Transactional
    public SwapRequestDTO acceptSwapRequest(Long requestId, Long userId) {
        SwapRequest swapRequest = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new AuthException("Swap request not found"));

        // Verify user is the receiver
        if (!swapRequest.getReceiver().getId().equals(userId)) {
            throw new AuthException("You are not authorized to accept this request");
        }

        // Update status
        swapRequest.setStatus(SwapRequestStatus.ACCEPTED);
        SwapRequest updatedRequest = swapRequestRepository.save(swapRequest);

        // Create a session for this swap
        sessionService.createSessionFromSwapRequest(updatedRequest);

        return convertToDTO(updatedRequest);
    }

    // Reject a swap request
    @Transactional
    public SwapRequestDTO rejectSwapRequest(Long requestId, Long userId) {
        SwapRequest swapRequest = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new AuthException("Swap request not found"));

        // Verify user is the receiver
        if (!swapRequest.getReceiver().getId().equals(userId)) {
            throw new AuthException("You are not authorized to reject this request");
        }

        // Update status
        swapRequest.setStatus(SwapRequestStatus.REJECTED);
        SwapRequest updatedRequest = swapRequestRepository.save(swapRequest);

        return convertToDTO(updatedRequest);
    }

    // Cancel a swap request
    @Transactional
    public SwapRequestDTO cancelSwapRequest(Long requestId, Long userId) {
        SwapRequest swapRequest = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new AuthException("Swap request not found"));

        // Verify user is the sender
        if (!swapRequest.getSender().getId().equals(userId)) {
            throw new AuthException("You are not authorized to cancel this request");
        }

        // Update status
        swapRequest.setStatus(SwapRequestStatus.CANCELLED);
        SwapRequest updatedRequest = swapRequestRepository.save(swapRequest);

        return convertToDTO(updatedRequest);
    }

    // Get swap request by ID
    public SwapRequestDTO getSwapRequestById(Long requestId, Long userId) {
        SwapRequest swapRequest = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new AuthException("Swap request not found"));

        // Verify user is involved in the request
        if (!swapRequest.getSender().getId().equals(userId) && 
            !swapRequest.getReceiver().getId().equals(userId)) {
            throw new AuthException("You are not authorized to view this request");
        }

        return convertToDTO(swapRequest);
    }

    // Helper methods for conversion
    private SwapRequestDTO convertToDTO(SwapRequest swapRequest) {
        SwapRequestDTO dto = new SwapRequestDTO();
        dto.setId(swapRequest.getId());
        dto.setSender(convertToUserDTO(swapRequest.getSender()));
        dto.setReceiver(convertToUserDTO(swapRequest.getReceiver()));
        dto.setTeachSkill(convertToSkillDTO(swapRequest.getTeachSkill()));
        dto.setLearnSkill(convertToSkillDTO(swapRequest.getLearnSkill()));
        dto.setStatus(swapRequest.getStatus());
        dto.setMessage(swapRequest.getMessage());
        dto.setCreatedAt(swapRequest.getCreatedAt());
        dto.setUpdatedAt(swapRequest.getUpdatedAt());
        return dto;
    }

    private List<SwapRequestDTO> convertToDTOList(List<SwapRequest> requests) {
        List<SwapRequestDTO> dtos = new ArrayList<>();
        for (SwapRequest request : requests) {
            dtos.add(convertToDTO(request));
        }
        return dtos;
    }

    private in.sb.SkillSwap.dto.UserDTO convertToUserDTO(User user) {
        in.sb.SkillSwap.dto.UserDTO userDTO = new in.sb.SkillSwap.dto.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setBio(user.getBio());
        userDTO.setRating(user.getRating());
        return userDTO;
    }

    private in.sb.SkillSwap.dto.SkillDTO convertToSkillDTO(Skill skill) {
        return new in.sb.SkillSwap.dto.SkillDTO(
                skill.getId(),
                skill.getName(),
                skill.getDescription(),
                skill.getCategory()
        );
    }
}