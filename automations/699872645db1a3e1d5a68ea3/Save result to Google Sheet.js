// Save the candidate’s parsed data, fit score, and questions to Google Sheet using google-spreadsheet
const { GoogleSpreadsheet } = require("google-spreadsheet")
const { JWT } = require("google-auth-library")

;(async () => {
  try {
    const candidateData = getContext("candidateData") || {}
    const scoreData = getContext("scoreData") || {}
    const questions = getContext("interviewQuestions") || []
    // Set up Google Sheets authentication
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const key = process.env.GOOGLE_PRIVATE_KEY
    const sheetId = process.env.GOOGLE_SHEET_ID
    if (!email || !key || !sheetId) throw new Error("Missing Google Sheets credentials or ID.")
    // Remove escaped line breaks in private key (if present)
    const fixedKey = key.replace(/\\n/g, "\n")
    const auth = new JWT({ email, key: fixedKey, scopes: ["https://www.googleapis.com/auth/spreadsheets"] })
    const doc = new GoogleSpreadsheet(sheetId, auth)
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    // Prepare row data
    const row = {
      email: candidateData.email ?? "",
      degree: candidateData.degree ?? "",
      gpa: candidateData.gpa ?? "",
      skills: Array.isArray(candidateData.skills) ? candidateData.skills.join(", ") : "",
      projects: Array.isArray(candidateData.projects) ? candidateData.projects.join(", ") : "",
      fit_score: scoreData.score ?? "",
      rationale: scoreData.rationale ?? "",
      questions: Array.isArray(questions) ? questions.join(" | ") : ""
    }
    await sheet.addRow(row)
    setContext("sheetStatus", "OK")
    console.log("Candidate data saved to Google Sheet.", row)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
