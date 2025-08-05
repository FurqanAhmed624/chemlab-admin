import { gql } from '@apollo/client';
import { Chemical } from '@/features/chemicals/data/schema';

export const GET_ALL_CHEMICALS_WITH_HISTORY = gql`
  query GetAllChemicalsWithHistory(
    $page: Int
    $limit: Int
    $filters: ChemicalHistoryFilterInput
  ) {
    getAllChemicalsWithHistory(page: $page, limit: $limit, filters: $filters) {
      count
      page
      pageSize
      items {
        id
        created_at
        updated_at
        createdBy {
          id
          name
        }
        updatedBy {
          id
          name
        }
        versionHistory {
          id
          name
          status
          location
          changeReason
          created_at
          percentage
          dateStarted
          dateEnded
          containerType
          volumeOrMass
          unit
          location
          safetyInstructions
          status
          rfidTag
          invoicePdfUrl
          changeReason
          health
          flammability
          instability
          specialHazard
          readyForCollection
      
          changedBy {
            id
            name
          }
        }
      }
    }
  }
`;

export interface GetAllChemicalsData {
  getAllChemicalsWithHistory: {
    count: number;
    page: number;
    pageSize: number;
    items: Chemical[];
  };
}

export interface GetAllChemicalsVars {
  page?: number;
  limit?: number;
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}