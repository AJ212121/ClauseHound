import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorkerSrc from "pdfjs-dist/build/pdf.worker?url";
GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
import mammoth from "mammoth";

export async function fileToText(file: File): Promise<string> {
  if (file.type === "application/pdf") {
    // PDF extraction
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items
        .map((item: any) => 'str' in item ? item.str : '')
        .join(" ") + "\n";
    }
    return text;
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // DOCX extraction
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  } else {
    throw new Error("Unsupported file type");
  }
} 