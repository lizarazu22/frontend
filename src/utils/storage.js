export const safeSetItem = (key, value, remember = false) => {
    if (typeof window !== 'undefined') {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  };
  
  export const safeGetItem = (key) => {
    if (typeof window !== 'undefined') {
      let item = sessionStorage.getItem(key);
      if (item === null) item = localStorage.getItem(key);
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    }
    return null;
  };
  
  export const safeRemoveItem = (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  };
  