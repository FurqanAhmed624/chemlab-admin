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

export const REVERT_CHEMICAL = gql`
  mutation RevertToPreviousVersion($input: RevertChemicalInput!) {
    revertChemical(input: $input) {
      id
      updated_at
      updatedBy {
        id
        name
      }
      activeVersion {
        id
        name
        status
        changeReason
        created_at
      }
    }
  }
`;

// ... (keep existing interfaces)

// --- ADD INTERFACES FOR THE NEW MUTATION ---
export interface RevertChemicalData {
  revertChemical: Chemical;
}

export interface RevertChemicalVars {
  input: {
    chemicalId: string;
    versionId: string;
  };
}