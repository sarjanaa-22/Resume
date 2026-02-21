// Get candidate data & compare vs. job description (default: Software Engineer). Score 0–100.
;(async () => {
  try {
    const candidateData = getContext("candidateData")
    let jobDesc = getContext("jobDescription")
    if (!jobDesc) {
      jobDesc = "Software Engineer" // fallback
    }
    // Use OpenAI to calculate a fit score based on job description and candidate data
    const fitPrompt = `Given the following resume data and job description, score the fit (0–100) and produce only the JSON: { score: number, rationale: string }.\nResume: ${JSON.stringify(candidateData)}\nJob Description: ${jobDesc}`
    const result = await TurboticOpenAI([{ role: "user", content: fitPrompt }], { model: "gpt-4.1", temperature: 0 })

    let scoreData = {}
    try {
      scoreData = JSON.parse(result.content)
    } catch (e) {
      scoreData = { error: "Could not parse score AI response", raw: result.content }
    }
    setContext("scoreData", scoreData)
    console.log("Scoring complete:", scoreData)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
