// 'use client';

// import React from 'react';
// import { AdminProvider } from '@/contexts/AdminContext';

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <AdminProvider>
//       {children}
//     </AdminProvider>
//   );
// }



// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import { tokenStorage } from "@/utils/token"
// import { AdminType, User } from '@/types/admin.types';

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   login: (token: string) => void
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = tokenStorage.get()
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]))
//         console.log("Token is  :  " + token  + "     Payload is :   "+ JSON.stringify(payload));
//         setUser(payload)
//       } catch {
//         tokenStorage.remove()
//       }
//     }
//     setLoading(false)
//   }, [])

//   const login = (token: string) => {
//     tokenStorage.set(token)
//     const payload = JSON.parse(atob(token.split(".")[1]))
//     setUser(payload)
//   }

//   const logout = () => {
//     tokenStorage.remove()
//     setUser(null)
//     window.location.href = "/auth/login"
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) throw new Error("useAuth must be used within AuthProvider")
//   return context
// }

'use client';

import React from 'react';
import { AdminProvider } from '@/contexts/AdminContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}
