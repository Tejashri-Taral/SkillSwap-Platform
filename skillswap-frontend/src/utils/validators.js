export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const validateSkillName = (name) => {
  return name.length >= 2 && name.length <= 100;
};

export const validateBio = (bio) => {
  return bio.length <= 500;
};

export const validateRating = (rating) => {
  return rating >= 1 && rating <= 5;
};

export const validateSessionNotes = (notes) => {
  return notes.length <= 1000;
};

export const validateMeetingUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};