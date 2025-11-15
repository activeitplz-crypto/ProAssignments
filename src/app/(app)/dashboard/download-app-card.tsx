
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Link from 'next/link';

export function DownloadAppCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Download className="h-6 w-6 text-primary" />
          Get the Mobile App
        </CardTitle>
        <CardDescription>
          For the best and smoothest experience, download and install our mobile application on your device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="https://web2apkpro.com/public_download.php?project_id=2547&token=e3a1121a43" target="_blank">
            Download Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
