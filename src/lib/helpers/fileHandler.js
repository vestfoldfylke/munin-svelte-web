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
 * @returns {Promise<Object>} Updated state values
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
  
  console.log("files", files);

  let fileType = files[0].type;
  let newMessageHistory = [...messageHistory];
  let newImageB64 = [...imageB64];
  let newDokFiles = [...dokFiles];
  let newFilArray = [...filArray];

  // Function to read a file as DataURL and return a promise
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (fileType.split("/")[0] === "image") {
    // Reset the image array
    newImageB64 = [];
    
    // Process all image files asynchronously
    const imagePromises = Array.from(files).map(async (file) => {
      try {
        const dataUrl = await readFileAsDataURL(file);
        return dataUrl;
      } catch (error) {
        console.error("Error reading image file:");
        return null;
      }
    });
    
    // Wait for all files to be processed
    const results = await Promise.all(imagePromises);
    
    // Filter out any failed reads and update state
    const validResults = results.filter(result => result !== null);
    newImageB64 = validResults;
    
    // Add each image to message history
    validResults.forEach(result => {
      newMessageHistory.push({
        role: "user",
        content: result
      });
    });
    
  } else if (fileType.split("/")[0] === "application") {
    // Reset document arrays
    newDokFiles = [];
    newFilArray = [];
    
    // If there are document files, validate them first
    const filesToProcess = files;
    
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
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
    
    // Process all document files asynchronously
    const docPromises = Array.from(filesToProcess).map(async (file) => {
      try {
        const dataUrl = await readFileAsDataURL(file);
        return { 
          name: file.name,
          dataUrl: dataUrl
        };
      } catch (error) {
        console.error("Error reading document file:");
        return null;
      }
    });
    
    // Wait for all files to be processed
    const results = await Promise.all(docPromises);
    
    // Filter out any failed reads and update state
    const validResults = results.filter(result => result !== null);
    
    validResults.forEach(result => {
      newMessageHistory.push({
        role: "user",
        content: result.name
      });
      newDokFiles.push(result.dataUrl);
      newFilArray.push({
        name: result.name,
        type: "application/pdf"
      });
    });
  }

  return {
    messageHistory: newMessageHistory,
    imageB64: newImageB64,
    dokFiles: newDokFiles,
    filArray: newFilArray,
    fileSelect: newImageB64.length > 0 || newDokFiles.length > 0
  };
}