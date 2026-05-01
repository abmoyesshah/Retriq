import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
  provider: "email" | "google";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "ai-assistant:auth-user";
const USERS_KEY = "ai-assistant:users";

const COLORS = [
  "262 83% 70%", "200 90% 60%", "340 80% 65%", "160 70% 50%",
  "30 95% 60%", "280 85% 70%", "190 85% 55%",
];

const pickColor = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
};

type StoredUser = User & { password?: string };

const getUsers = (): StoredUser[] => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
};
const saveUsers = (u: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error("No account found with that email");
    if (found.password !== password) throw new Error("Incorrect password");
    const { password: _p, ...safe } = found;
    persist(safe);
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name: name || email.split("@")[0],
      avatarColor: pickColor(email),
      provider: "email",
      password,
    };
    saveUsers([...users, newUser]);
    const { password: _p, ...safe } = newUser;
    persist(safe);
  };

  const loginWithGoogle = async () => {
    await new Promise((r) => setTimeout(r, 500));
    const email = "demo.user@gmail.com";
    const users = getUsers();
    let found = users.find((u) => u.email === email);
    if (!found) {
      found = {
        id: crypto.randomUUID(),
        email,
        name: "Demo User",
        avatarColor: pickColor(email),
        provider: "google",
      };
      saveUsers([...users, found]);
    }
    const { password: _p, ...safe } = found;
    persist(safe);
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
