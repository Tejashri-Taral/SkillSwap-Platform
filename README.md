# SkillSwap - Skill Exchange Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SkillSwap** is a full-stack platform that allows users to **teach and learn skills** by connecting with others through live sessions. Users can create profiles, discover skill matches, chat, track progress, and rate each other.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [License](#license)

---

## Features
- User registration and authentication with **JWT**
- Skill-based matching algorithm
- Real-time chat between users
- Live sessions powered by **Jitsi**
- User profile, progress tracking, and ratings
- RESTful APIs for backend operations
- Responsive frontend using **React.js**

---

## Tech Stack
- **Backend:** Spring Boot, MySQL, JWT, RESTful APIs  
- **Frontend:** React.js  
- **Real-time Communication:** Jitsi  
- **Database:** MySQL  

---

## Usage 

- Sign up and log in to create your account.
- Add skills you can teach or want to learn.
- Discover potential skill matches suggested by the system.
- Chat with matched users and schedule live sessions via Jitsi.
- Track your learning progress and provide ratings/feedback after sessions.

---
## How It Works

1. User Authentication: Users register and log in using JWT-secured authentication.

2. Skill Matching: Users list skills to teach or learn. The platform matches users based on interests.

3. Session Management: Users schedule live sessions using Jitsi integration.

4. Real-Time Communication: Chat functionality enables users to coordinate sessions.

5. Progress Tracking: User profiles store learning history, session progress, and ratings.

6. Backend Operations: Spring Boot RESTful APIs handle user management, skill matching, sessions, and ratings.
