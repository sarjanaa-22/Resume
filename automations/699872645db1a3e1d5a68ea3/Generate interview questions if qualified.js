// Generate 3 technical interview questions for candidate if fit score >75, using projects as a guide.
;(async () => {
  try {
    const scoreData = getContext("scoreData")
    const candidateData = getContext("candidateData")
    if (!scoreData || typeof scoreData.score !== "number") {
      throw new Error("Fit score not found.")
    }
    let questions = []
    if (scoreData.score > 75) {
      // Use candidate's projects to generate targeted questions
      const projList = Array.isArray(candidateData.projects) ? candidateData.projects.join("; ") : ""
      const prompt = `Based on the following student projects: ${projList}, write 3 unique, advanced technical interview questions relevant to a Software Engineer interview.\nOutput as JSON array of questions.`
      const result = await TurboticOpenAI([{ role: "user", content: prompt }], { model: "gpt-4.1", temperature: 0 })
      try {
        questions = JSON.parse(result.content)
      } catch (e) {
        questions = [result.content] // fallback to raw string
      }
    }
    setContext("interviewQuestions", questions)
    console.log("Generated questions:", questions)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
