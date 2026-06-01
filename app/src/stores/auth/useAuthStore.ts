import type { UserData } from '@/infrastructure/interfaces/responses/get-user.response.ts';
import { create } from 'zustand';

import { checkAuthAction } from '@/core/actions/auth/check-auth.action';
import { loginAction } from '@/core/actions/auth/login.action';
import * as SecureStore from 'expo-secure-store';
import { getUniqueDeviceId } from '@/infrastructure/security/deviceSecurity';
import { useSecurityStore } from '@/stores/security/useSecurityStore';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

type AuthState = {
  // Properties
  user: UserData | null;
  token: string | null;
  authStatus: AuthStatus;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  revalidatePassword: (password: string) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  authStatus: 'checking',

  // Actions
  login: async (email: string, password: string) => {
    try {
      const deviceId = await getUniqueDeviceId();
      const data = await loginAction(email, password, deviceId);
      await SecureStore.setItemAsync('token', data.token);

      if (data.security) {
        useSecurityStore.getState().setSecurityFlags(data.security);
      }

      set({
        user: data.user,
        token: data.token,
        authStatus: 'authenticated',
      });

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      await SecureStore.deleteItemAsync('token');
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated',
      });
      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ user: null, token: null, authStatus: 'not-authenticated' });
  },

  checkAuthStatus: async () => {
    try {
      const { user, token } = await checkAuthAction();
      await SecureStore.setItemAsync('token', token);
      set({
        user: user,
        token: token,
        authStatus: 'authenticated',
      });
      return true;
    } catch (error) {
      console.warn(error);
      await SecureStore.deleteItemAsync('token');
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated',
      });

      return false;
    }
  },

  revalidatePassword: async (password: string) => {
    try {
      const email = get().user!.email;
      if (!email) return false;
      const deviceId = await getUniqueDeviceId();
      const data = await loginAction(email, password, deviceId);
      await SecureStore.setItemAsync('token', data.token);
      set({ token: data.token });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },
}));
