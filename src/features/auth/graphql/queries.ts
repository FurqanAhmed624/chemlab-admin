import { gql } from '@apollo/client';
import { User } from '@/features/users/data/schema';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        name
        email
        avatar
        roles {
          name
          permissions {
            name
          }
        }
      }
    }
  }
`;

export interface LoginData {
  login: {
    accessToken: string;
    user: User;
  };
}

export interface LoginVars {
  input: {
    email: string;
    password: string;
  };
}