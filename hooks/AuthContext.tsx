// hooks/AuthContext.tsx
import { supabase } from "@/supabase";
import { createContext, useContext, useEffect, useState } from "react";

type UserProfile = {
  id: string;
  user_name: string;
  email: string;
  name?: string;
  instrument?: string;
  genre?: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data && !error) {
      setUser(data);
    } else {
      setUser(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile(); // initial session check

    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!session) {
        setUser(null);
      } else {
        fetchProfile(); // fetch updated user
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// export function useAuth() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const login = async (emailOrUsername: string, password: string) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Try login with email
//       let { data, error } = await supabase.auth.signInWithPassword({
//         email: emailOrUsername,
//         password,
//       });

//       // Fallback: if login fails and the input wasn’t an email, try username lookup
//       if (error && !emailOrUsername.includes("@")) {
//         const userRes = await supabase
//           .from("users")
//           .select("email")
//           .eq("user_name", emailOrUsername)
//           .single();

//         if (userRes.error || !userRes.data?.email) {
//           throw new Error("Invalid username or password");
//         }

//         const { error: secondTryError } = await supabase.auth.signInWithPassword({
//           email: userRes.data.email,
//           password,
//         });

//         if (secondTryError) throw secondTryError;
//       } else if (error) {
//         throw error;
//       }

//       router.replace("/"); // or your home screen
//     } catch (err: any) {
//       setError(err.message || "Login failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { login, isLoading, error };
// }
