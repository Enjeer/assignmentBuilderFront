import { DocumentState } from "../document/types"

export const exportToDocx = (
    document: DocumentState
) => {
  // здесь преобразование block → docx структура
    console.log("Exporting to DOCX", document)
}