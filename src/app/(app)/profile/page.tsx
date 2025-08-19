
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { ProfileForm } from './profile-form';
import { MOCK_USERS } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { getSession } from '@/lib/session';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.email) {
        // Base profile from our "database"
        const baseUser = MOCK_USERS.find(u => u.email === session.email);
        
        // Client-side updates from localStorage
        const storedUserStr = localStorage.getItem(`user-profile-${session.email}`);
        const storedUser = storedUserStr ? JSON.parse(storedUserStr) : {};
        
        if (baseUser) {
          setUser({ ...baseUser, ...storedUser });
        }
      }
    };
    fetchUser();
  }, []);

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    if (user && user.email) {
      const newUser = { ...user, ...updatedProfile };
      setUser(newUser);
      localStorage.setItem(`user-profile-${user.email}`, JSON.stringify(newUser));
    }
  };
  
  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <UserProfileCard 
        name={user.name || 'Anonymous'}
        username={user.email?.split('@')[0] || 'anonymous'}
        avatarUrl={user.avatarUrl}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your name and profile picture here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} onUpdate={handleProfileUpdate} />
        </CardContent>
      </Card>
    </div>
  );
}
