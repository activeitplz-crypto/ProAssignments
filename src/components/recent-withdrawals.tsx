
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
  { name: 'Ahmad', amount: 3400 }, { name: 'Ayesha', amount: 6800 },
  { name: 'Bilal', amount: 2900 }, { name: 'Mehak', amount: 4500 },
  { name: 'Hamza', amount: 9200 }, { name: 'Zara', amount: 2300 },
  { name: 'Usman', amount: 5600 }, { name: 'Hina', amount: 3100 },
  { name: 'Farhan', amount: 8700 }, { name: 'Iqra', amount: 2500 },
  { name: 'Junaid', amount: 6200 }, { name: 'Laiba', amount: 1900 },
  { name: 'Arsalan', amount: 4300 }, { name: 'Maria', amount: 2800 },
  { name: 'Talha', amount: 7500 }, { name: 'Rida', amount: 3600 },
  { name: 'Danish', amount: 5900 }, { name: 'Saba', amount: 2400 },
  { name: 'Salman', amount: 9500 }, { name: 'Komal', amount: 2200 },
  { name: 'Umer', amount: 4700 }, { name: 'Nimra', amount: 2600 },
  { name: 'Asad', amount: 8100 }, { name: 'Zoya', amount: 3200 },
  { name: 'Noman', amount: 6400 }, { name: 'Hoorain', amount: 2100 },
  { name: 'Kamran', amount: 4900 }, { name: 'Mahnoor', amount: 2700 },
  { name: 'Fahad', amount: 7800 }, { name: 'Aleena', amount: 2500 },
  { name: 'Hassan', amount: 5100 }, { name: 'Anaya', amount: 3000 },
  { name: 'Adeel', amount: 9000 }, { name: 'Fatima', amount: 2800 },
  { name: 'Imran', amount: 4200 }, { name: 'Amna', amount: 2300 },
  { name: 'Saad', amount: 6600 }, { name: 'Eman', amount: 3300 },
  { name: 'Shahzaib', amount: 5700 }, { name: 'Saira', amount: 2600 },
  { name: 'Ali', amount: 8400 }, { name: 'Mahira', amount: 2900 },
  { name: 'Rehan', amount: 4800 }, { name: 'Hoor', amount: 1800 },
  { name: 'Murtaza', amount: 6300 }, { name: 'Zainab', amount: 2400 },
  { name: 'Ayan', amount: 5500 }, { name: 'Noor', amount: 3700 },
  { name: 'Haris', amount: 9800 }, { name: 'Bisma', amount: 2100 },
  { name: 'Zubair', amount: 1200 }, { name: 'Nida', amount: 4500 },
  { name: 'Waqas', amount: 7800 }, { name: 'Sobia', amount: 3200 },
  { name: 'Tariq', amount: 8800 }, { name: 'Fozia', amount: 2100 },
  { name: 'Kashif', amount: 6500 }, { name: 'Sidra', amount: 5300 },
  { name: 'Raheel', amount: 2900 }, { name: 'Lubna', amount: 9200 },
  { name: 'Atif', amount: 4800 }, { name: 'Saima', amount: 2500 },
  { name: 'Adnan', amount: 7800 }, { name: 'Shazia', amount: 3400 },
  { name: 'Mohsin', amount: 5500 }, { name: 'Farah', amount: 4200 },
  { name: 'Yasir', amount: 9100 }, { name: 'Sumaira', amount: 2300 },
  { name: 'Nadeem', amount: 6800 }, { name: 'Uzma', amount: 3900 },
  { name: 'Shakeel', amount: 4700 }, { name: 'Samina', amount: 5600 },
  { name: 'Faisal', amount: 8200 }, { name: 'Humaira', amount: 2100 },
  { name: 'Rashid', amount: 7100 }, { name: 'Nadia', amount: 3300 },
  { name: 'Zahid', amount: 5900 }, { name: 'Arooj', amount: 4800 },
  { name: 'Irfan', amount: 9400 }, { name: 'Faiza', amount: 2700 },
  { name: 'Waqar', amount: 6300 }, { name: 'Sadaf', amount: 4100 },
  { name: 'Tahir', amount: 8800 }, { name: 'Aalia', amount: 2200 },
  { name: 'Abbas', amount: 5000 }, { name: 'Ghazala', amount: 4500 },
  { name: 'Ejaz', amount: 7200 }, { name: 'Rozina', amount: 3100 },
  { name: 'Ejaz', amount: 9800 }, { name: 'Huma', amount: 2000 },
  { name: 'Ghaffar', amount: 6100 }, { name: 'Shabana', amount: 4900 },
  { name: 'Javed', amount: 8300 }, { name: 'Noreen', amount: 2400 },
  { name: 'Maqsood', amount: 5700 }, { name: 'Nazia', amount: 3700 },
  { name: 'Nasir', amount: 7500 }, { name: 'Rukhsana', amount: 4300 },
  { name: 'Qasim', amount: 9000 }, { name: 'Yasmin', amount: 2800 },
  { name: 'Rizwan', amount: 6900 }, { name: 'Afshan', amount: 3500 },
  { name: 'Sajid', amount: 5200 }, { name: 'Farzana', amount: 4600 },
  { name: 'Tauseef', amount: 8700 }, { name: 'Parveen', amount: 2500 },
  { name: 'Zeeshan', amount: 7300 }, { name: 'Fariha', amount: 3900 },
  { name: 'Aamir', amount: 5400 }, { name: 'Sadia', amount: 4200 },
  { name: 'Anwar', amount: 9600 }, { name: 'Sanam', amount: 2200 },
  { name: 'Babar', amount: 6700 }, { name: 'Tahira', amount: 3800 },
  { name: 'Dawud', amount: 4900 }, { name: 'Aqeela', amount: 5100 },
  { name: 'Haroon', amount: 8000 }, { name: 'Bushra', amount: 2900 },
  { name: 'Iftikhar', amount: 7600 }, { name: 'Shehla', amount: 3600 },
  { name: 'Khalid', amount: 5800 }, { name: 'Nighat', amount: 4400 },
  { name: 'Mujahid', amount: 9300 }, { name: 'Zarina', amount: 2700 },
  { name: 'Nawaz', amount: 6400 }, { name: 'Abida', amount: 4000 },
  { name: 'Rafiq', amount: 8500 }, { name: 'Fehmida', amount: 2300 },
  { name: 'Sabir', amount: 5100 }, { name: 'Jamila', amount: 4700 },
  { name: 'Shafiq', amount: 8900 }, { name: 'Nasreen', amount: 2600 },
  { name: 'Waheed', amount: 7000 }, { name: 'Quratulain', amount: 3400 },
  { name: 'Zafar', amount: 5600 }, { name: 'Rubina', amount: 4900 },
  { name: 'Akbar', amount: 9900 }, { name: 'Salma', amount: 2100 },
  { name: 'Arif', amount: 6200 }, { name: 'Shamim', amount: 3800 },
  { name: 'Ayaz', amount: 4800 }, { name: 'Suraiya', amount: 5200 },
  { name: 'Fawad', amount: 8400 }, { name: 'Tabassum', amount: 3000 },
  { name: 'Habib', amount: 7700 }, { name: 'Zubaida', amount: 3700 },
  { name: 'Imtiaz', amount: 5300 }, { name: 'Azra', amount: 4500 },
  { name: 'Jamil', amount: 9200 }, { name: 'Bilqees', amount: 2400 },
  { name: 'Latif', amount: 6600 }, { name: 'Dilshad', amount: 4100 },
  { name: 'Mansoor', amount: 8100 }, { name: 'Erum', amount: 2900 },
  { name: 'Mubashir', amount: 5900 }, { name: 'Farida', amount: 4300 },
  { name: 'Mushtaq', amount: 9700 }, { name: 'Gulshan', amount: 2600 },
  { name: 'Naseem', amount: 7400 }, { name: 'Ishrat', amount: 3500 },
  { name: 'Rauf', amount: 5000 }, { name: 'Kaneez', amount: 4800 },
  { name: 'Saif', amount: 8600 }, { name: 'Musarrat', amount: 2700 },
  { name: 'Shahid', amount: 6900 }, { name: 'Nusrat', amount: 4200 },
  { name: 'Sohail', amount: 9100 }, { name: 'Qamar', amount: 2200 },
  { name: 'Wajid', amount: 6000 }, { name: 'Reshma', amount: 3900 },
  { name: 'Yousuf', amount: 8800 }, { name: 'Sultana', amount: 3100 },
  { name: 'Zakir', amount: 5500 }, { name: 'Tayyaba', amount: 4600 },
  { name: 'Aslam', amount: 9500 }, { name: 'Wajiha', amount: 2000 },
  { name: 'Ehsan', amount: 7200 }, { name: 'Zahida', amount: 3300 },
  { name: 'Ghulam', amount: 5300 }, { name: 'Afsana', amount: 5000 },
  { name: 'Haider', amount: 8200 }, { name: 'Benazir', amount: 2800 },
  { name: 'Ilyas', amount: 6400 }, { name: 'Durriya', amount: 3600 }, { name: 'Fauzia', amount: 3600 },
  { name: 'Khalil', amount: 9000 }, { name: 'Haseena', amount: 2500 },
  { name: 'Mehmood', amount: 5700 }, { name: 'Jameela', amount: 4400 },
  { name: 'Munir', amount: 8400 }, { name: 'Kausar', amount: 3000 },
  { name: 'Naeem', amount: 6100 }, { name: 'Maimoona', amount: 4700 },
  { name: 'Rehman', amount: 9800 }, { name: 'Nighat', amount: 2100 },
  { name: 'Saeed', amount: 7800 }, { name: 'Parveen', amount: 3900 },
  { name: 'Shahbaz', amount: 5600 }, { name: 'Qudsia', amount: 4200 },
  { name: 'Suhail', amount: 8900 }, { name: 'Robina', amount: 2700 },
  { name: 'Wasim', amount: 6500 }, { name: 'Shagufta', amount: 4100 },
  { name: 'Zahid', amount: 9400 }, { name: 'Talath', amount: 2400 },
  { name: 'Afzal', amount: 7100 }, { name: 'Uzma', amount: 3800 },
  { name: 'Akram', amount: 5200 }, { name: 'Valerie', amount: 4900 },
  { name: 'Altaf', amount: 8600 }, { name: 'Warda', amount: 2600 },
  { name: 'Azhar', amount: 6800 }, { name: 'Yasmeen', amount: 3700 },
  { name: 'Ejaz', amount: 9700 }, { name: 'Zahra', amount: 2200 },
  { name: 'Feroz', amount: 7300 }, { name: 'Amber', amount: 4300 },
  { name: 'Hashim', amount: 5400 }, { name: 'Beenish', amount: 5000 },
  { name: 'Iqbal', amount: 8000 }, { name: 'Cyra', amount: 2900 },
  { name: 'Liaqat', amount: 6200 }, { name: 'Durdana', amount: 3600 },
  { name: 'Masood', amount: 9300 }, { name: 'Fakhra', amount: 2300 },
  { name: 'Murtaza', amount: 5800 }, { name: 'Gazala', amount: 4500 },
  { name: 'Noman', amount: 8500 }, { name: 'Haniya', amount: 3100 },
  { name: 'Rashid', amount: 6700 }, { name: 'Jannat', amount: 4000 },
  { name: 'Saleem', amount: 9100 }, { name: 'Kiran', amount: 2800 },
  { name: 'Shams', amount: 7500 }, { name: 'Madiha', amount: 3900 },
  { name: 'Umar', amount: 5100 }, { name: 'Naila', amount: 4700 },
  { name: 'Waqar', amount: 8300 }, { name: 'Oruba', amount: 2100 },
  { name: 'Zubair', amount: 6000 }, { name: 'Razia', amount: 4400 },
  { name: 'Aamir', amount: 9600 }, { name: 'Sabrina', amount: 2500 },
  { name: 'Bilal', amount: 7900 }, { name: 'Tehmina', amount: 3800 },
  { name: 'Fahad', amount: 5700 }, { name: 'Urooj', amount: 4600 },
  { name: 'Hammad', amount: 8800 }, { name: 'Vaneeza', amount: 3000 },
  { name: 'Junaid', amount: 6300 }, { name: 'Wajeeha', amount: 4100 },
  { name: 'Mohsin', amount: 9200 }, { name: 'Xyla', amount: 2700 },
  { name: 'Rizwan', amount: 7000 }, { name: 'Yumna', amount: 3500 },
  { name: 'Tariq', amount: 5900 }, { name: 'Zimal', amount: 4900 },
  { name: 'Adnan', amount: 8100 }, { name: 'Aiman', amount: 2300 },
  { name: 'Farhan', amount: 6600 }, { name: 'Bisma', amount: 4200 },
  { name: 'Kamran', amount: 9400 }, { name: 'Dania', amount: 2600 },
  { name: 'Nadeem', amount: 7200 }, { name: 'Eshal', amount: 3700 },
  { name: 'Saad', amount: 5300 }, { name: 'Fatima', amount: 4800 },
  { name: 'Usman', amount: 8700 }, { name: 'Gull', amount: 3100 },
  { name: 'Zain', amount: 6400 }, { name: 'Hareem', amount: 4000 },
  { name: 'Arshad', amount: 9000 }, { name: 'Isha', amount: 2400 },
  { name: 'Dawar', amount: 7100 }, { name: 'Javeria', amount: 3900 },
  { name: 'Ghaffar', amount: 5000 }, { name: 'Kinza', amount: 4500 },
  { name: 'Imran', amount: 8200 }, { name: 'Laraib', amount: 2900 },
  { name: 'Khurram', amount: 6800 }, { name: 'Mishal', amount: 3600 },
  { name: 'Qaiser', amount: 9500 }, { name: 'Neelam', amount: 2200 },
  { name: 'Shahzad', amount: 7600 }, { name: 'Pakeeza', amount: 4300 },
  { name: 'Yasir', amount: 5500 }, { name: 'Rimsha', amount: 5100 },
  { name: 'Abrar', amount: 8400 }, { name: 'Sania', amount: 2700 },
  { name: 'Cyrus', amount: 6100 }, { name: 'Tania', amount: 3800 },
  { name: 'Ehtisham', amount: 9900 }, { name: 'Urwa', amount: 2000 },
  { name: 'Gohar', amount: 7700 }, { name: 'Vasia', amount: 4100 },
  { name: 'Ismail', amount: 5200 }, { name: 'Wania', amount: 4700 },
  { name: 'Luqman', amount: 8600 }, { name: 'Zainab', amount: 3000 },
  { name: 'Osama', amount: 6900 }, { name: 'Alina', amount: 3500 },
  { name: 'Rameez', amount: 9100 }, { name: 'Barira', amount: 2500 },
  { name: 'Shehryar', amount: 7400 }, { name: 'Dua', amount: 4400 },
  { name: 'Taimur', amount: 5800 }, { name: 'Fiza', amount: 4900 },
  { name: 'Wahab', amount: 8300 }, { name: 'Hira', amount: 2600 },
  { name: 'Zohaib', amount: 6200 }, { name: 'Jannat', amount: 3900 },
  { name: 'Ahmar', amount: 9700 }, { name: 'Kainat', amount: 2100 },
  { name: 'Burhan', amount: 7000 }, { name: 'Maheen', amount: 4200 },
  { name: 'Daud', amount: 5600 }, { name: 'Nawal', amount: 4800 },
  { name: 'Fahim', amount: 8000 }, { name: 'Omaima', amount: 2800 },
  { name: 'Hamid', amount: 6500 }, { name: 'Qurat', amount: 3700 },
  { name: 'Jibran', amount: 9800 }, { name: 'Rameen', amount: 2300 },
  { name: 'Moeen', amount: 7300 }, { name: 'Sahar', amount: 4000 },
  { name: 'Qadeer', amount: 5400 }, { name: 'Tooba', amount: 5000 },
  { name: 'Shahrukh', amount: 8900 }, { name: 'Varda', amount: 2400 },
  { name: 'Zia', amount: 6700 }, { name: 'Wania', amount: 3600 },
  { name: 'Aziz', amount: 9600 }, { name: 'Zoha', amount: 2900 },
  { name: 'Daniyal', amount: 7800 }, { name: 'Alishba', amount: 4300 },
  { name: 'Gibran', amount: 5100 }, { name: 'Bakhtawar', amount: 4700 },
  { name: 'Irfan', amount: 8500 }, { name: 'Daneen', amount: 3100 },
  { name: 'Kazim', amount: 6400 }, { name: 'Eshaal', amount: 3800 },
  { name: 'Mudassir', amount: 9200 }, { name: 'Fabeha', amount: 2200 },
  { name: 'Raafay', amount: 7100 }, { name: 'Haleema', amount: 4100 },
  { name: 'Sufyan', amount: 5900 }, { name: 'Ifra', amount: 4600 },
  { name: 'Waleed', amount: 8100 }, { name: 'Jasia', amount: 3000 },
  { name: 'Zayyan', amount: 6000 }, { name: 'Kanza', amount: 3500 },
  { name: 'Affan', amount: 9400 }, { name: 'Manahil', amount: 2500 },
  { name: 'Behroz', amount: 7500 }, { name: 'Nayab', amount: 4400 },
  { name: 'Dayyan', amount: 5000 }, { name: 'Ojala', amount: 4900 },
  { name: 'Ghazanfar', amount: 8700 }, { name: 'Pareesa', amount: 2800 },
  { name: 'Isa', amount: 6300 }, { name: 'Raniya', amount: 3700 },
  { name: 'Labeeb', amount: 9100 }, { name: 'Samra', amount: 2100 },
  { name: 'Moazzam', amount: 7900 }, { name: 'Tatheer', amount: 4200 },
  { name: 'Omair', amount: 5500 }, { name: 'Waniya', amount: 4800 },
  { name: 'Rayyan', amount: 8800 }, { name: 'Zarnish', amount: 3200 },
  { name: 'Tabish', amount: 6900 }, { name: 'Aiza', amount: 3900 },
  { name: 'Yawar', amount: 9000 }, { name: 'Bano', amount: 2400 },
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

    

    