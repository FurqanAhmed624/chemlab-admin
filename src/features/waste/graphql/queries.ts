import { gql } from '@apollo/client';
import { Waste } from '@/features/waste/data/schema';

/**
 * The complete and correct GraphQL query document for fetching waste records
 * with their full version history, including all NFPA and audit fields.
 */
export const GET_ALL_WASTE_WITH_HISTORY = gql`
  query GetAllWasteWithHistory(
    $page: Int
    $limit: Int
    $filters: WasteHistoryFilterInput
  ) {
    getAllWasteWithHistory(page: $page, limit: $limit, filters: $filters) {
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
          # --- All fields are now requested ---
          id
          chemicalWasteName
          percentage
          dateStarted
          dateEnded
          containerType
          volumeOrMass
          unit
          placementLocation
          status
          notifyAdmin
          changeReason
          health
          flammability
          instability
          specialHazard
          created_at
          changedBy {
            id
            name
          }
        }
      }
    }
  }
`;

// These TypeScript types correctly define the shape of the data and variables
export interface GetAllWasteData {
  getAllWasteWithHistory: {
    count: number;
    page: number;
    pageSize: number;
    items: Waste[];
  };
}

export interface GetAllWasteVars {
  page?: number;
  limit?: number;
  filters?: {
    startDate?: string; // ISO Date String
    endDate?: string;   // ISO Date String
  };
}