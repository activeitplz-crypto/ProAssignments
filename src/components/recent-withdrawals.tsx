
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownCircle } from 'lucide-react';

const staticWithdrawals = [
  { name: 'Ahmad', amount: 2300 }, { name: 'Sana', amount: 4800 },
  { name: 'Bilal', amount: 7200 }, { name: 'Ayesha', amount: 3500 },
  { name: 'Hamza', amount: 9000 }, { name: 'Mehak', amount: 2800 },
  { name: 'Zain', amount: 9500 }, { name: 'Maria', amount: 5600 },
  { name: 'Ali', amount: 3200 }, { name: 'Fatima', amount: 8700 },
  { name: 'Hassan', amount: 1900 }, { name: 'Hina', amount: 2600 },
  { name: 'Umer', amount: 6800 }, { name: 'Zara', amount: 2200 },
  { name: 'Farhan', amount: 9800 }, { name: 'Iqra', amount: 3700 },
  { name: 'Saad', amount: 5300 }, { name: 'Laiba', amount: 4100 },
  { name: 'Shahzaib', amount: 2500 }, { name: 'Mahnoor', amount: 6200 },
  { name: 'Danish', amount: 7900 }, { name: 'Rabia', amount: 2900 },
  { name: 'Hammad', amount: 1800 }, { name: 'Khadija', amount: 8100 },
  { name: 'Usman', amount: 5900 }, { name: 'Eman', amount: 3400 },
  { name: 'Asad', amount: 4600 }, { name: 'Nimra', amount: 2300 },
  { name: 'Talha', amount: 6500 }, { name: 'Aleena', amount: 2700 },
  { name: 'Noman', amount: 3800 }, { name: 'Hafsa', amount: 9200 },
  { name: 'Salman', amount: 2100 }, { name: 'Rida', amount: 5400 },
  { name: 'Adeel', amount: 6300 }, { name: 'Amna', amount: 2900 },
  { name: 'Murtaza', amount: 7500 }, { name: 'Hoorain', amount: 3000 },
  { name: 'Fahad', amount: 5800 }, { name: 'Anaya', amount: 2400 },
  { name: 'Arsalan', amount: 9600 }, { name: 'Komal', amount: 4900 },
  { name: 'Junaid', amount: 2600 }, { name: 'Saba', amount: 8300 },
  { name: 'Rehan', amount: 3500 }, { name: 'Mishal', amount: 2100 },
  { name: 'Kamran', amount: 7800 }, { name: 'Zoya', amount: 2500 },
  { name: 'Imran', amount: 4400 }, { name: 'Mahira', amount: 6900 },
];

export function RecentWithdrawals() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % staticWithdrawals.length);
    }, 5000); // Cycle every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const currentWithdrawal = staticWithdrawals[currentIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ArrowDownCircle className="h-6 w-6 text-primary" />
          Recent Withdrawals
        </CardTitle>
        <CardDescription>
          A look at recent successful withdrawals from our users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-10 overflow-hidden">
            <div
              key={currentIndex}
              className="flex animate-in fade-in-0 slide-in-from-bottom-2 duration-500 items-center justify-between rounded-lg bg-muted/50 p-3"
            >
              <p>
                <span className="font-semibold">{currentWithdrawal.name}</span> withdrew{' '}
                <span className="font-bold text-primary">
                  {currentWithdrawal.amount.toLocaleString()} PKR
                </span>
              </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
