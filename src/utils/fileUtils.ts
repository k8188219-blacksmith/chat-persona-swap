
// Function to convert file to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Function to validate image file (type and size)
export const validateImageFile = (file: File): boolean => {
  // Check file type
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!acceptedTypes.includes(file.type)) {
    return false;
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};
