// features/reports/graphql/queries.ts

import { gql } from '@apollo/client';
import { ChemicalReport } from '@/features/reports/data/schema';

export const FETCH_CHEMICAL_REPORTS = gql`
  query FetchChemicalReports(
    $page: Int
    $limit: Int
    $filters: ChemicalReportFilterInput
  ) {
    fetchReportChemicals(page: $page, limit: $limit, filters: $filters) {
      count
      page
      pageSize
      items {
        id
        status
        createdAt
        user {
          id
          email
        }
        chemical {
          id
          activeVersion {
            name
            status
            location
          }
        }
      }
    }
  }
`;

export const UPDATE_CHEMICAL_REPORT_STATUS = gql`
  mutation UpdateChemicalReportStatus($reportId: String!, $status: ChemicalReportStatus!) {
    updateChemicalReportStatus(reportId: $reportId, status: $status) {
      id
      status
    }
  }
`;


export interface FetchChemicalReportsData {
  fetchReportChemicals: {
    count: number;
    page: number;
    pageSize: number;
    items: ChemicalReport[];
  };
}

export interface FetchChemicalReportsVars {
  page?: number;
  limit?: number;
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}

export interface UpdateChemicalReportStatusData {
  updateChemicalReportStatus: Pick<ChemicalReport, 'id' | 'status'>;
}

export interface UpdateChemicalReportStatusVars {
  reportId: string;
  status: string;
}

export const PENDING_REPORTS_COUNT_QUERY = gql`
  query PendingChemicalReportsCount {
    pendingChemicalReportsCount
  }
`;

export interface PendingReportsCountData {
  pendingChemicalReportsCount: number;
}