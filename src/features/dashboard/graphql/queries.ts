import { gql } from '@apollo/client';
import { AnalyticsData } from '../data/schema';

// --- UPDATED: The query no longer includes getSelfProfile ---
export const GET_DASHBOARD_ANALYTICS = gql`
  query GetDashboardAnalytics {
    getChemicalAnalytics {
      stats {
        totalChemicals
        lowStockCount
        outOfStockCount
        mostCommonLocation
      }
      activityLast3Months {
        date
        newlyAdded
        updated
      }
    }
    getWasteAnalytics {
      stats {
        totalRecords
        pendingCollection
        disposedCount
        mostCommonWasteType
      }
      activityLast3Months {
        date
        newlyCreated
      }
    }
  }
`;

// --- UPDATED: The TypeScript type is now simpler ---
export interface GetAnalyticsData {
  getChemicalAnalytics: AnalyticsData['chemicalAnalytics'];
  getWasteAnalytics: AnalyticsData['wasteAnalytics'];
}