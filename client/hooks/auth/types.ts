export interface User {
  name: string;
  // loggedIn: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  // loading: boolean;
}
