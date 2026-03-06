'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarHalf, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Amna Abbas',
    avatar: 'https://i.postimg.cc/s2fxXYnR/download_(1).jpg',
    rating: 4.5,
    content: 'Main ne recently ProAssignments join kiya hai aur experience kaafi acha raha. Assignments simple hotay hain aur instructions clear hoti hain. Mujhe ghar baith kar kaam karne ka moka mil raha hai. Daily thori bohat earning bhi ho jati hai jo kaafi helpful hai.'
  },
  {
    name: 'Areeba Khan',
    avatar: 'https://i.postimg.cc/wBxMvXWH/GIRL_DP.jpg',
    rating: 5,
    content: 'ProAssignments mere liye ek acha platform sabit hua. Main student hun aur free time mein assignments likh kar earning kar leti hun. Process simple hai aur guide bhi easily mil jati hai. Mujhe yahan ka system kaafi easy laga.'
  },
  {
    name: 'Hina Tariq',
    avatar: 'https://i.postimg.cc/FKFzRyPv/download_(2).jpg',
    rating: 4.5,
    content: 'Mujhe online kaam dhundhna mushkil lag raha tha lekin ProAssignments se start karna easy tha. Daily assignments mil jate hain aur kaam bhi zyada complicated nahi hota. Ghar baith kar kaam karne ka ye acha option hai.'
  },
  {
    name: 'Usman Ali',
    avatar: 'https://i.postimg.cc/vm8TBrPb/hksalaar.jpg',
    rating: 4,
    content: 'Main ne curiosity mein ProAssignments join kiya tha aur experience theek raha. Assignments mil jate hain aur kaam simple hota hai. Jo log writing kar sakte hain unke liye ye ek acha side earning option ho sakta hai.'
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
                <p className="text-xs font-medium italic text-muted-foreground leading-relaxed">
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
