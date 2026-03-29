import { create } from 'zustand';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  role: string;
  // add more claims as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get('jwt_token') || null,
  login: (token: string) => {
    Cookies.set('jwt_token', token, { expires: 1 }); // 1 day
    const decoded: any = jwtDecode(token);
    set({ token, user: { email: decoded.sub, role: decoded.role } });
  },
  logout: () => {
    Cookies.remove('jwt_token');
    set({ token: null, user: null });
  },
}));