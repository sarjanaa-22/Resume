const pdf = require('pdf-parse/lib/pdf-parse.js'); 

;(async () => {
  try {
    const buffer = getContext("resumePdfBuffer");
    if (!buffer) throw new Error("No PDF found! Please re-upload your resume in Step 1.");

    // This reads the SARJANAASN resume content automatically
    const textResult = await pdf(buffer);
    const resumeText = textResult.text;
    setContext("resumeText", resumeText);
    
    console.log("✅ Resume text extracted successfully!");

    // Sending the text to AI to format it for your Google Sheet
    const aiPrompt = `Extract the following from this resume as a JSON object: 
    {
      "name": "Full Name",
      "email": "Email",
      "skills": ["List technical skills"],
      "projects": ["List major projects"],
      "degree": "Current Degree"
    } 
    Resume Text: ${resumeText}`;

    const result = await TurboticOpenAI(
        [{ role: "user", content: aiPrompt }], 
        { model: "gpt-4o", temperature: 0 }
    );

    const cleanJSON = result.content.replace(/```json|```/g, "").trim();
    const candidateData = JSON.parse(cleanJSON);
    
    // This saves your name (SARJANAASN) into the system context
    setContext("candidateData", candidateData);
    console.log("✅ Data ready for Google Sheet:", candidateData.name);

  } catch (e) {
    console.error("❌ Automation Error:", e.message);
    process.exit(1);
  }
})();