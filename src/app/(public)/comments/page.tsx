
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const communityReviews = [
    {
        name: 'Amna Abbas',
        avatar_url: 'https://i.postimg.cc/s2fxXYnR/download_(1).jpg',
        content: 'Main ne recently ProAssignments join kiya hai aur experience kaafi acha raha. Assignments simple hotay hain aur instructions clear hoti hain. Daily thori bohat earning bhi ho jati hai.',
    },
    {
        name: 'Areeba Khan',
        avatar_url: 'https://i.postimg.cc/wBxMvXWH/GIRL_DP.jpg',
        content: 'ProAssignments mere liye ek acha platform sabit hua. Main student hun aur free time mein assignments likh kar earning kar leti hun. System kaafi easy hai.',
    },
    {
        name: 'Usman Ali',
        avatar_url: 'https://i.postimg.cc/vm8TBrPb/hksalaar.jpg',
        content: 'Jo log writing kar sakte hain unke liye ye ek acha side earning option ho sakta hai. Assignments mil jate hain aur payouts timely hain.',
    },
    {
        name: 'Mariam Zahra',
        avatar_url: 'https://i.postimg.cc/wBxMvXWH/GIRL_DP.jpg',
        content: 'Being a housewife, it was hard to find work that fits my schedule. ProAssignment allows me to earn during my free time comfortably from home.',
    },
    {
        name: 'Faizan Sheikh',
        avatar_url: 'https://i.postimg.cc/vm8TBrPb/hksalaar.jpg',
        content: 'Reliable platform for students in Pakistan. The withdrawal to Easypaisa is very convenient and fast. Highly recommended!',
    },
    {
        name: 'Iqra Jabeen',
        avatar_url: 'https://i.postimg.cc/s2fxXYnR/download_(1).jpg',
        content: 'Excellent support team and clear instructions. I started with the Basic plan and upgraded to Premium because of the consistent earnings.',
    },
    {
        name: 'Hamza Malik',
        avatar_url: 'https://i.postimg.cc/vm8TBrPb/hksalaar.jpg',
        content: 'The best part is that no referral is needed for withdrawal. You get paid for your hard work directly. Truly transparent policy.',
    },
    {
        name: 'Nida Fatima',
        avatar_url: 'https://i.postimg.cc/wBxMvXWH/GIRL_DP.jpg',
        content: 'Very happy with my experience here. Handwriting assignments are therapeutic and earning from them is a bonus!',
    }
];

export default function CommentsPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-12 px-4">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Network Voices</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
        <h1 className="font-display text-5xl tracking-wider text-foreground">
            <span>USER <span className="text-primary italic">COMMENTS</span></span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
            Real testimonials from the elite community
        </p>
      </div>
      
      <div className="space-y-8">
        {communityReviews.map((review, index) => (
          <Card key={index} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white group hover:translate-y-[-4px] transition-all duration-500">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <Avatar className="h-24 w-24 border-[6px] border-primary/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <AvatarImage src={review.avatar_url} alt={review.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-2xl font-black text-primary">
                      {review.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
              </Avatar>
              
              <div className="space-y-4 max-w-2xl">
                  <cite className="text-xl not-italic font-black uppercase tracking-tighter text-slate-900 leading-none">
                    {review.name}
                  </cite>
                  <blockquote className="relative">
                    <p className="text-lg font-medium italic text-slate-600 leading-relaxed">
                      "{review.content}"
                    </p>
                  </blockquote>
              </div>
              
              <div className="pt-2">
                  <span className="bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full">Verified Partner</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
