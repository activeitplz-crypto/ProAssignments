
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import type { SocialLink } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default async function SocialPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: socialLinks, error } = await supabase
    .from('social_links')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching social links:', error);
    return <div>Could not load social links. Please try again later.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-3xl">
            <Share2 className="h-8 w-8 text-primary" />
            Follow Our Socials
          </CardTitle>
          <CardDescription>
            Stay up-to-date with the latest news, updates, and announcements by following our social media accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {socialLinks && socialLinks.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {(socialLinks as SocialLink[]).map((link) => (
                <Link
                  key={link.id}
                  href={link.social_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 rounded-lg p-4 transition-transform hover:scale-110 hover:bg-muted"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/50 bg-background group-hover:border-primary">
                     <Image
                        src={link.icon_url}
                        alt={`${link.name} icon`}
                        fill
                        className="object-contain p-2"
                        data-ai-hint="social icon"
                      />
                  </div>
                  <span className="font-semibold text-foreground">{link.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                <p className="text-center text-muted-foreground">
                    No social media links have been added yet.
                    <br />
                    Please check back later!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
