
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarHalf, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Arafa',
    avatar: 'https://i.postimg.cc/1zMjV6rk/𝗣ＩＮ-Ｂ𝗬-ＬＡＤＤＩ.jpg',
    rating: 5,
    content: 'Main ek student hun. Pocket money ke liye join kia tha. Ab apni fees khud pay karti hun. 40k earn kar chuki hun. Ye meri best decision thi.'
  },
  {
    name: 'Zainab',
    avatar: 'https://i.postimg.cc/wBxMvXWH/GIRL_DP.jpg',
    rating: 5,
    content: 'Jab first time payment receive hui toh meri khushi ka thikana nahi tha. Pehly sirf loss hota tha, ab profit hi profit hai. Recommend karti hun sabko.'
  },
  {
    name: 'Komal Tariq',
    avatar: 'https://i.postimg.cc/BvXpjD8Y/dp.jpg',
    rating: 5,
    content: 'Very supportive team and fast withdrawals. I have been working here for 2 months now and the experience is amazing. Highly recommended for students.'
  },
  {
    name: 'Amna Abbas',
    avatar: 'https://i.postimg.cc/s2fxXYnR/download_(1).jpg',
    rating: 5,
    content: 'Main ne recently ProAssignments join kiya hai aur experience kaafi acha raha. Assignments simple hotay hain aur instructions clear hoti hain. Daily thori bohat earning bhi ho jati hai.'
  },
  {
    name: 'Usman Ali',
    avatar: 'https://i.postimg.cc/vm8TBrPb/hksalaar.jpg',
    rating: 4.5,
    content: 'Jo log writing kar sakte hain unke liye ye ek acha side earning option ho sakta hai. Payouts timely hain.'
  },
  {
    name: 'Sadia Malik',
    avatar: 'https://i.postimg.cc/SsWCKXYL/download_(4).jpg',
    rating: 5,
    content: 'The assignment verification system is super fast. I upload my handwritten assignments and get approval within minutes. Very reliable platform.'
  },
  {
    name: 'Bilal Ahmad',
    avatar: 'https://i.postimg.cc/Hn3gd2YH/image.jpg',
    rating: 4.5,
    content: 'ProAssignment has been a game-changer for me. As a university student, the flexible tasks help me cover my extra expenses.'
  },
  {
    name: 'Faizan Sheikh',
    avatar: 'https://i.postimg.cc/nrTJpkHW/En_route_again.jpg',
    rating: 5,
    content: 'Reliable platform for students in Pakistan. The withdrawal to Easypaisa is very convenient and fast. Highly recommended!'
  },
  {
    name: 'Mariam Zahra',
    avatar: 'https://i.postimg.cc/DZqLzW4q/Modest_Muslim_Fashion_Elegant_Niqab_Style_Inspiration.jpg',
    rating: 5,
    content: 'Being a housewife, it was hard to find work that fits my schedule. ProAssignment allows me to earn during my free time.'
  }
];

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex gap-0.5 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="h-3 w-3 fill-current" />}
    </div>
  );
}

export function MemberReviews() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Quote className="h-4 w-4 text-primary opacity-40" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Member Reviews</h3>
      </div>
      
      <div className="grid gap-4">
        {reviews.map((review, index) => (
          <Card key={index} className="border-none bg-white shadow-lg rounded-[2rem] overflow-hidden group hover:translate-y-[-2px] transition-all">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 border-[4px] border-primary/5 shadow-md">
                <AvatarImage src={review.avatar} alt={review.name} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {review.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <RatingStars rating={review.rating} />
                <p className="text-sm font-black uppercase tracking-tight text-slate-900">{review.name}</p>
              </div>

              <blockquote className="max-w-xs">
                <p className="text-xs font-medium italic text-slate-600 leading-relaxed">
                  {review.content}
                </p>
              </blockquote>

              <div className="pt-2">
                <span className="bg-green-500/10 text-green-600 text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  Verified Partner
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
