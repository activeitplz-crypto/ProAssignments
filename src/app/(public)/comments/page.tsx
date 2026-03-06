import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const staticReviews = [
    {
        name: 'Amna Abbas',
        avatar_url: 'https://i.postimg.cc/s2fxXYnR/download_(1).jpg',
        content: 'Main ne recently ProAssignments join kiya hai aur experience kaafi acha raha. Assignments simple hotay hain aur instructions clear hoti hain. Mujhe ghar baith kar kaam karne ka moka mil raha hai. Daily thori bohat earning bhi ho jati hai jo kaafi helpful hai.',
    },
    {
        name: 'Areeba Khan',
        avatar_url: 'https://i.postimg.cc/wBxMvXWH/GIRL_DP.jpg',
        content: 'ProAssignments mere liye ek acha platform sabit hua. Main student hun aur free time mein assignments likh kar earning kar leti hun. Process simple hai aur guide bhi easily mil jati hai. Mujhe yahan ka system kaafi easy laga.',
    },
    {
        name: 'Hina Tariq',
        avatar_url: 'https://i.postimg.cc/FKFzRyPv/download_(2).jpg',
        content: 'Mujhe online kaam dhundhna mushkil lag raha tha lekin ProAssignments se start karna easy tha. Daily assignments mil jate hain aur kaam bhi zyada complicated nahi hota. Ghar baith kar kaam karne ka ye acha option hai.',
    },
    {
        name: 'Usman Ali',
        avatar_url: 'https://i.postimg.cc/vm8TBrPb/hksalaar.jpg',
        content: 'Main ne curiosity mein ProAssignments join kiya tha aur experience theek raha. Assignments mil jate hain aur kaam simple hota hai. Jo log writing kar sakte hain unke liye ye ek acha side earning option ho sakta hai.',
    }
];

export default function CommentsPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="font-display flex items-center justify-center gap-3 text-5xl tracking-wider text-foreground">
            <MessageSquare className="h-10 w-10 text-primary" />
            <span>USER <span className="text-primary">COMMENTS</span></span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs">
            What our community says about their journey
        </p>
      </div>
      
      <div className="space-y-8">
        {staticReviews.map((review, index) => (
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
                      {review.content}
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
