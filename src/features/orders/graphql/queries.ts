import { gql } from '@apollo/client';
import { Order } from '@/features/orders/data/schema';

// Query to fetch a paginated list of orders
export const GET_ALL_ORDERS = gql`
  query GetAllOrders(
    $page: Int
    $limit: Int
    $filters: OrderFilterInput
  ) {
    getAllOrders(page: $page, limit: $limit, filters: $filters) {
      count
      page
      pageSize
      items {
        id
        chemicalName
        vendor
        quantity
        unit
        status
        created_at
        updated_at
      }
    }
  }
`;

// Mutation to update an orders
export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      status
      updated_at
    }
  }
`;

// --- TypeScript Interfaces for GraphQL Operations ---

export interface GetAllOrdersData {
  getAllOrders: {
    count: number;
    page: number;
    pageSize: number;
    items: Order[];
  };
}

export interface GetAllOrdersVars {
  page?: number;
  limit?: number;
  filters?: {
    status?: string;
    // Add other filters like chemicalName, vendor here if needed
  };
}

export interface UpdateOrderData {
  updateOrder: Pick<Order, 'id' | 'status' | 'updated_at'>;
}

export interface UpdateOrderVars {
  input: {
    id: string;
    status: string;
    // You could add other fields here if the dialog allowed more edits
  };
}