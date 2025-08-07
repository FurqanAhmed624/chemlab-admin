import { gql } from '@apollo/client';
import { Invoice } from '../data/schema';

// Query to fetch a paginated list of all invoices
export const GET_ALL_INVOICES = gql`
  query GetAllInvoices(
    $page: Int
    $limit: Int
    $filters: InvoiceFilterInput
  ) {
    getAllInvoices(page: $page, limit: $limit, filters: $filters) {
      count
      page
      pageSize
      items {
        id
        s3Key
        originalFilename
        mimeType
        referenceText
        notes
        createdAt
      }
    }
  }
`;

// Query to get a secure, temporary URL for a single invoice
export const GET_VIEWABLE_INVOICE_URL = gql`
  query GetViewableInvoiceUrl($invoiceId: String!) {
    getViewableInvoiceUrl(invoiceId: $invoiceId)
  }
`;

// --- TypeScript Interfaces for GraphQL Operations ---

export interface GetAllInvoicesData {
  getAllInvoices: {
    count: number;
    page: number;
    pageSize: number;
    items: Invoice[];
  };
}

export interface GetAllInvoicesVars {
  page?: number;
  limit?: number;
  filters?: {
    originalFilename?: string;
    referenceText?: string;
  };
}

export interface GetViewableUrlData {
  getViewableInvoiceUrl: string;
}

export interface GetViewableUrlVars {
  invoiceId: string;
}