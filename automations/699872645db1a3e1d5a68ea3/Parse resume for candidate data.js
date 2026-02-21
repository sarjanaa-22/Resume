// This version removes the broken 'PDFParse' class and uses the correct function call
const pdf = require('pdf-parse');

;(async () => {
  try {
    const buffer = getContext("resumePdfBuffer");
    if (!buffer) throw new Error("Missing PDF buffer. Make sure Step 1 is connected.");

    // SUCCESSFUL METHOD: Call pdf() directly on the buffer
    const textResult = await pdf(buffer);
    const resumeText = textResult.text;
    setContext("resumeText", resumeText);
    
    console.log("PDF Text Extracted Successfully!");

    // AI logic to extract your specific details
    const aiPrompt = `Extract from this resume as JSON: { "name": "", "email": "", "skills": [], "projects": [] }. Text: ${resumeText}`;
    const result = await TurboticOpenAI([{ role: "user", content: aiPrompt }], { model: "gpt-4o", temperature: 0 });

    const candidateData = JSON.parse(result.content.replace(/```json|```/g, ""));
    setContext("candidateData", candidateData);
    
    console.log("Candidate data ready:", candidateData);
  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
})();