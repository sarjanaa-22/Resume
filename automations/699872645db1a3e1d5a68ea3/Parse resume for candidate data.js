// Optimized PDF Parser for Turbotic
const pdf = require('pdf-parse');

;(async () => {
  try {
    // 1. Get the file buffer from the previous step
    const buffer = getContext("resumePdfBuffer");
    if (!buffer) {
      console.error("No PDF buffer found. Make sure Step 1 is linked.");
      throw new Error("Missing PDF buffer.");
    }

    // 2. Extract text from the PDF buffer
    const textResult = await pdf(buffer);
    const resumeText = textResult.text;
    setContext("resumeText", resumeText);
    
    console.log("Successfully extracted text from PDF.");

    // 3. Use AI to extract structured data
    const aiPrompt = `Extract the following information from this resume text as a JSON object: 
    {
      "name": "Full Name",
      "email": "Email Address",
      "skills": ["skill1", "skill2"],
      "gpa": "GPA or Percentage",
      "projects": ["Project Name 1", "Project Name 2"],
      "degree": "Degree Name"
    }
    Resume Text:
    ${resumeText}`;

    // Using gpt-4o for better JSON extraction
    const result = await TurboticOpenAI(
      [{ role: "user", content: aiPrompt }], 
      { model: "gpt-4o", temperature: 0 }
    );

    // 4. Clean and Parse the JSON response
    let candidateData = {};
    try {
      // Remove any markdown code blocks if AI included them (```json ... ```)
      const cleanContent = result.content.replace(/```json|```/g, "").trim();
      candidateData = JSON.parse(cleanContent);
    } catch (e) {
      console.warn("AI didn't return perfect JSON, using fallback.");
      candidateData = { rawText: result.content };
    }

    // 5. Store data for the Google Sheet and Scoring steps
    setContext("candidateData", candidateData);
    console.log("Candidate data ready for Google Sheets:", candidateData);

  } catch (e) {
    console.error("Critical Error in Step 2:", e.message);
    process.exit(1);
  }
})();