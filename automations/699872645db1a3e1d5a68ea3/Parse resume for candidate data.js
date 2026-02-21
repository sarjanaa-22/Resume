// Optimized PDF Parser for Turbotic
const pdfParse = require('pdf-parse');

;(async () => {
  try {
    const buffer = getContext("resumePdfBuffer");
    if (!buffer) throw new Error("Missing PDF buffer.");

    // This fix handles the "pdf is not a function" error 
    // by checking if the function is nested or direct
    const pdfFunc = typeof pdfParse === 'function' ? pdfParse : pdfParse.default || pdfParse;
    
    const textResult = await pdfFunc(buffer);
    const resumeText = textResult.text;
    setContext("resumeText", resumeText);
    
    console.log("PDF Text Extracted successfully!");

    // AI logic to extract your details
    const aiPrompt = `Extract as JSON: { "name": "", "email": "", "skills": [], "projects": [] }. Text: ${resumeText}`;
    const result = await TurboticOpenAI([{ role: "user", content: aiPrompt }], { model: "gpt-4o", temperature: 0 });

    const cleanContent = result.content.replace(/```json|```/g, "").trim();
    const candidateData = JSON.parse(cleanContent);
    setContext("candidateData", candidateData);
    
    console.log("Candidate data ready for Google Sheet:", candidateData.name);

  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
})();