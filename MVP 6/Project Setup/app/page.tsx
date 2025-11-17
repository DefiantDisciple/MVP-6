import { redirect } from 'next/navigation';

export default function RootPage() {
  // Fallback for production deployment
  if (typeof window !== 'undefined') {
    window.location.href = '/landing';
    return null;
  }
  
  redirect('/landing');
}
