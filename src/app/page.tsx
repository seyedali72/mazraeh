'use client'
import StartPage from './auth/login/page';
import { useUser } from './context/UserProvider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useUser()
  const router = useRouter()

  if (user?._id !== undefined) { router.replace('/pb/dashboard') }
  return (
    <StartPage />
  );
};

