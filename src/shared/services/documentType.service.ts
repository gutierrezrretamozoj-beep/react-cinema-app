import api from "@/shared/api/client";
import type { DocumentType } from "@/shared/interfaces/documentType";

/**
 * Service responsible for fetching document types.
 */
export class DocumentTypeService {
  /**
   * Retrieves all available document types.
   * @returns Promise resolving to an array of document types
   */
  async getAll(): Promise<DocumentType[]> {
    const { data } = await api.get<DocumentType[]>("/document-types");
    return data;
  }
}

export const documentTypeService = new DocumentTypeService();
