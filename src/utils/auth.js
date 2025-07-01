import { safeGetItem, safeRemoveItem } from './storage';

export const isAuthenticated = () => {
  return !!safeGetItem('token');
};

export const logout = () => {
  safeRemoveItem('token');
};
