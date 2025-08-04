
export const validateField = (field: string, value: string) => {
  switch (field) {
    case 'name':
      return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
    case 'phone':
      // Phone is optional, but if provided should be valid
      if (value && value.length > 0) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
        return !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
      }
      return '';
    default:
      return '';
  }
};
