// "use client"
// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { User, AuthContextType } from './types';

// // Define types for the context state and actions




// interface BuyBidProviderProps {
//   children: ReactNode;
// }

// interface BuyBidContextType {
//   openBuyModal: boolean;
//   openBidModal: boolean;
// }

// // Create the context with a default value
// const AuthContext = createContext<BuyBidContextType>({
//   openBuyModal: false,
//   openBidModal: false
// });

// // Create the AuthProvider component
// const BuyBidProvider = ({ children }: BuyBidProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [openBuyModal, setBuyModal] = useState<boolean>(false);
//   const [openBidBidModal, setBidModal] = useState<boolean>(false);
  

//   // useEffect(() => {
//   //   // Check if user data is stored in localStorage
//   //   const storedUser = JSON.parse(localStorage.getItem('user') as string);
//   //   if (storedUser) {
//   //     setUser(storedUser);
//   //     setIsAuthenticated(true);
//   //   }
//   // }, []);

//   const openBidModalHandler = () => {
//     console.log('user');
//     localStorage.setItem('user', JSON.stringify(user));
//     localStorage.setItem('token', token);
//     setUser(user);
//     setIsAuthenticated(true);
//   };

//   const getToken = () => {
//     return localStorage.getItem('token');
//   }

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };
