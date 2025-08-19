
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
import { MOCK_USER } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';


export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  useEffect(() => {
    const storedUser = localStorage.getItem('user-profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    const newUser = { ...user, ...updatedProfile };
    setUser(newUser);
    localStorage.setItem('user-profile', JSON.stringify(newUser));
  };


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
