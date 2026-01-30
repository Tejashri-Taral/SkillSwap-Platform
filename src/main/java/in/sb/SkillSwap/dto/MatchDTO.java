package in.sb.SkillSwap.dto;

public class MatchDTO {
    private UserDTO user;
    private Integer matchScore;
    private SkillDTO skillTheyCanTeachYou;    // They → You (Other user teaches you)
    private SkillDTO skillYouCanTeachThem;    // You → Them (You teach other user)
    private String matchDescription;

    // Default constructor
    public MatchDTO() {
    }

    // Constructor
    public MatchDTO(UserDTO user, Integer matchScore, SkillDTO skillTheyCanTeachYou, 
                   SkillDTO skillYouCanTeachThem, String matchDescription) {
        this.user = user;
        this.matchScore = matchScore;
        this.skillTheyCanTeachYou = skillTheyCanTeachYou;
        this.skillYouCanTeachThem = skillYouCanTeachThem;
        this.matchDescription = matchDescription;
    }

    // Getters and Setters
    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public SkillDTO getSkillTheyCanTeachYou() {
        return skillTheyCanTeachYou;
    }

    public void setSkillTheyCanTeachYou(SkillDTO skillTheyCanTeachYou) {
        this.skillTheyCanTeachYou = skillTheyCanTeachYou;
    }

    public SkillDTO getSkillYouCanTeachThem() {
        return skillYouCanTeachThem;
    }

    public void setSkillYouCanTeachThem(SkillDTO skillYouCanTeachThem) {
        this.skillYouCanTeachThem = skillYouCanTeachThem;
    }

    public String getMatchDescription() {
        return matchDescription;
    }

    public void setMatchDescription(String matchDescription) {
        this.matchDescription = matchDescription;
    }
}