import { useState, useEffect } from 'react';
import PublicSite from '@/components/PublicSite';
import AdminPanel from '@/components/AdminPanel';

export default function App() {
  const [route, setRoute] = useState<string>(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isAdmin = route.startsWith('#/admin');

  return isAdmin ? <AdminPanel /> : <PublicSite />;
}
