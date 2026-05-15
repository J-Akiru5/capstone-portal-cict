import * as mammoth from "mammoth"

export async function convertDocxToHtml(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ buffer })
    return result.value // The generated HTML
  } catch (error) {
    console.error("Error converting DOCX to HTML:", error)
    throw new Error("Failed to convert document.")
  }
}
