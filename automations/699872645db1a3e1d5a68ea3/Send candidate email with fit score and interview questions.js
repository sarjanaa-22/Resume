// Send an email to the candidate email found in resume or prompt (if available) with their score and interview prep questions.
;(async () => {
  try {
    const candidateData = getContext("candidateData") || {}
    const scoreData = getContext("scoreData") || {}
    const questions = getContext("interviewQuestions") || []
    // You might want to extract/get the student's email from candidateData
    const email = candidateData.email || process.env.DEFAULT_STUDENT_EMAIL
    if (!email) throw new Error("Candidate email was not found or provided.")
    const questionText = questions.length ? questions.map((q, idx) => `<li>${q}</li>`).join("") : "<li>No questions generated</li>"
    const html = `<h2>Your Placement Application Results</h2><p>Fit Score: <b>${scoreData.score ?? "N/A"}</b></p><p>${scoreData.rationale ?? ""}</p><h3>Technical Interview Prep Questions:</h3><ol>${questionText}</ol>`
    const text = `Fit Score: ${scoreData.score}\n${scoreData.rationale}\nTechnical Interview Prep Questions:\n${questions.join("\n")}`
    const result = await sendEmailViaTurbotic({
      to: email,
      subject: "Your Student Placement Application Results",
      html,
      text
    })
    setContext("emailStatus", result)
    console.log("Email sent:", result)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
