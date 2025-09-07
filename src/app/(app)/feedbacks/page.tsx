
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function FeedbacksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-3xl">
            <MessageSquare className="h-8 w-8 text-primary" />
            Feedbacks
          </CardTitle>
          <CardDescription>
            This page is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                <p className="text-center text-muted-foreground">
                    The feedbacks feature is coming soon.
                    <br />
                    Check back later to see what other users are saying!
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
