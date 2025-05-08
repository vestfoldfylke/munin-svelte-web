/**
 * Handles file selection for image and PDF uploads in the chat interface.
 * Converts selected files to base64 format and updates the message history and file arrays.
 * 
 * @param {Event} event - The file input change event
 * @param {Array} messageHistory - The current message history array
 * @param {Array} imageFiles - Array of image files
 * @param {Array} dokFileInput - Array of document files
 * @param {Array} imageB64 - Array to store base64 encoded images
 * @param {Array} dokFiles - Array to store base64 encoded documents
 * @param {Array} filArray - Array to store file metadata
 * @returns {Object} Updated state values
 */
export const handleFileSelect = async (event, {
  messageHistory,
  imageFiles,
  dokFileInput,
  imageB64,
  dokFiles,
  filArray
}) => {
  const files = event.target.files;
  if (!files || files.length === 0) return {
    messageHistory,
    imageB64,
    dokFiles,
    filArray,
    fileSelect: false
  };
  
  const fileType = files[0].type;
  let newMessageHistory = [...messageHistory];
  let newImageB64 = [...imageB64];
  let newDokFiles = [...dokFiles];
  let newFilArray = [...filArray];
  
  if (fileType.split("/")[0] === "image") {
    newImageB64 = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          newMessageHistory = [...newMessageHistory, {
            role: "user",
            content: reader.result
          }];
          newImageB64 = [...newImageB64, reader.result];
        } catch (error) {
          console.log("Noe gikk galt");
        }
      };
      reader.readAsDataURL(file); // This method reads the file as a base64 string
    }
  } else if (fileType.split("/")[0] === "application") {
    newDokFiles = [];
    newFilArray = [];
    
    for (let i = 0; i < dokFileInput.length; i++) {
      const file = dokFileInput[i];
      if (file.size > 32 * 1024 * 1024 || file.type !== "application/pdf") {
        alert("En eller flere filer er ikke pdf eller er for store. Maks 32MB");
        return {
          messageHistory,
          imageB64,
          dokFiles,
          filArray,
          fileSelect: false
        };
      }
    }
    
    for (let i = 0; i < dokFileInput.length; i++) {
      const file = dokFileInput[i];
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          newMessageHistory = [...newMessageHistory, {
            role: "user",
            content: file.name
          }];
          newDokFiles = [...newDokFiles, reader.result];
        } catch (error) {
          console.log("Noe gikk galt");
        }
      };
      reader.readAsDataURL(file);
    }
  }

  return {
    messageHistory: newMessageHistory,
    imageB64: newImageB64,
    dokFiles: newDokFiles,
    filArray: newFilArray,
    fileSelect: true
  };
};