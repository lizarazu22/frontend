import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { safeGetItem } from '../utils/storage';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const user = safeGetItem('user');
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles.length && !allowedRoles.includes(user.rol)) {
        router.replace('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
