// This step waits for a PDF resume upload, then reads the PDF file as a Buffer and stores in context
const fs = require("fs")

;(async () => {
  try {
    // Turbotic's file-upload trigger sets the uploaded file path in an env variable, e.g., RESUME_PDF_PATH
    const resumePdfPath = process.env.RESUME_PDF_PATH
    if (!resumePdfPath || !fs.existsSync(resumePdfPath)) {
      throw new Error("Uploaded resume PDF file not found. Please upload a file and set RESUME_PDF_PATH env variable.")
    }
    const buffer = fs.readFileSync(resumePdfPath)
    setContext("resumePdfBuffer", buffer)
    setContext("resumePdfPath", resumePdfPath)
    console.log("Resume PDF read successfully and buffer stored in context.")
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
