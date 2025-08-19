
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

export default async function ProfilePage() {
  const userProfile = {
    name: MOCK_USER.name || 'Anonymous',
    username: MOCK_USER.email?.split('@')[0] || 'anonymous',
  };

  return (
    <div className="space-y-6">
      <UserProfileCard name={userProfile.name} username={userProfile.username} />
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your name and profile picture here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm name={userProfile.name} />
        </CardContent>
      </Card>
    </div>
  );
}
