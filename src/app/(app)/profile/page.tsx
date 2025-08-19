
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = {
    name: user?.user_metadata.name || 'Anonymous',
    username: user?.email?.split('@')[0] || 'anonymous',
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
