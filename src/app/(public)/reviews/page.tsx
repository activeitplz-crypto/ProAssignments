
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const staticReviews = [
  {
    name: 'Javeria Khalid',
    avatar_url: 'https://i.postimg.cc/fbKrfcT5/8978109f62887c264ea9730af469b85b.jpg',
    content: 'Mujhe laga tha ke ghar baithe earning sirf ek sapna hai. Lekin ProAssignments ne woh sapna haqeeqat bana diya. Ab main apni pocket money khud manage karti hun 🌸',
  },
  {
    name: 'Arsalan Siddiqui',
    avatar_url: 'https://i.postimg.cc/TYMp0X47/c46a0aee637bb89bcf3dc82030b565fc.jpg',
    content: 'ProAssignments meri zindagi ka best platform hai. Pehle mujhe scams mile the, ab safe aur reliable earning ho rahi hai. Bohot recommend karta hun.',
  },
  {
    name: 'Nida Yasir',
    avatar_url: 'https://i.postimg.cc/5tkPxG8z/ce6fbe88ff98c81d43702f35cf0b81a5.jpg',
    content: 'Iss platform ki sabse achi baat hai ke koi hidden charges nahi hain. Jo earn karo wohi balance me show hota hai. Mujhe transparency bohot pasand aayi 👍',
  },
  {
    name: 'Ali Shan',
    avatar_url: 'https://i.postimg.cc/PrzdVzkZ/a3c2836ac35d8dbce05ee5ef99ce72a2.jpg',
    content: 'Main har kisi ko ek mashwara dunga: ProAssignments try zaroor karo. Ek baar join karoge to khud samjh jaoge ke yeh real hai 💯',
  },
  {
    name: 'Mehwish Akram',
    avatar_url: 'https://i.postimg.cc/MTM9XDYF/dc559e5a8c4f781c7730c29f1cb3a4e0.jpg',
    content: 'Main ghar bethe bore ho jati thi, ab assignments complete karke productive feel karti hun. Upar se earning bhi hoti hai 😍',
  },
  {
    name: 'Adnan Chaudhry',
    avatar_url: 'https://i.postimg.cc/5tGJQswc/aba08316130788b888ba6e27c57c1a7b.jpg',
    content: 'Mera ek hi sentence hai: ProAssignments = Trust + Earning + Growth. Bas sab kuch is me cover ho gaya ✅',
  },
  {
    name: 'Komal Nisar',
    avatar_url: 'https://i.postimg.cc/MGtD9L94/dd5acf514bb073ed8855c9f2c426e360.jpg',
    content: 'Pehle mujhe koi samjhata nahi tha kaise earn karna hai. Yahaan guide section aur support team ne har step clear kar diya. Ab daily ka kaam easy hai.',
  },
  {
    name: 'Waleed Asif',
    avatar_url: 'https://i.postimg.cc/g2gmmzj2/b9ed805a8c5ae4324bf9ff937a93545a.jpg',
    content: 'Main choti si feedback dunga: Yahaan paisa safe hai, kaam easy hai aur support 10/10 hai. Recommended 💯',
  },
  {
    name: 'Amna Sheikh',
    avatar_url: 'https://i.postimg.cc/8CyY7sgj/e1b0a8ef3252efbb578145216cb32332.jpg',
    content: 'Mujhe lagta tha online earning fake hai. Lekin ProAssignments ne mera view change kar diya. Ab har din ek new motivation milta hai 🌹',
  },
  {
    name: 'Shahzaib Rauf',
    avatar_url: 'https://i.postimg.cc/T3dfzLRs/d0b617342641cefc6b72c4f0b6e0af10.jpg',
    content: 'Ek student ke liye pocket money sab kuch hoti hai. Ab main apna kharcha khud chalata hun aur family proud feel karti hai.',
  },
  {
    name: 'Samreen Abbas',
    avatar_url: 'https://i.postimg.cc/6qZbb02v/835624a066f3ecc6fbc030f9829e992d.jpg',
    content: 'Har assignment karne ke baad mujhe lagta hai ke main apna waqt sahi jagah laga rahi hun. Bohot acha aur positive environment hai yahaan.',
  },
  {
    name: 'Yasir Mehmood',
    avatar_url: 'https://i.postimg.cc/50YxshxN/f07ef9df0d94afe6c635b189080a4627.jpg',
    content: 'Scam free aur transparent. Bas yehi 2 words sab kuch bayan kar dete hain. Thank you ProAssignments for this trusted platform 🌟',
  },
  {
    name: 'Iram Zehra',
    avatar_url: 'https://i.postimg.cc/850bS6Qm/92c68039daa89691f88e3a5c867e2c81.jpg',
    content: 'Mujhe sabse zyada pasand aaya yahaan ka user-friendly system. Sab kuch simple aur easy hai. Mujhe koi technical knowledge bhi nahi thi lekin samajh aa gaya.',
  },
  {
    name: 'Moiz Khan',
    avatar_url: 'https://i.postimg.cc/PqgQZN1K/Screenshot_20250908-112659.jpg',
    content: 'Alhamdulillah yahaan se mera pehla earning experience bohot acha raha. Ab is platform ko long term use karne ka plan hai.',
  },
  {
    name: 'Anila Yousaf',
    avatar_url: 'https://i.postimg.cc/sXkwWh6D/9375fd7623ae18bcb9da6cc428e1d6c0.jpg',
    content: 'Maine pehle socha yeh bhi fraud hoga. Lekin jab mere dost ko payment receive hui tab believe kiya. Ab main khud bhi daily earning karti hun.',
  },
  {
    name: 'Danish Irfan',
    avatar_url: 'https://i.postimg.cc/44MFPNsC/b7762884f4bb07a2e306f9d59107012d.jpg',
    content: 'ProAssignments = Peace of mind. Main har din ek assignment karta hun aur without stress paisa mil jata hai 💵',
  },
  {
    name: 'Farah Gul',
    avatar_url: 'https://i.postimg.cc/wxNWpwMt/996c309c49534bbd6ffd24a2e86eafc5.jpg',
    content: 'Yahaan ke assignments easy aur samajhne laayak hote hain. Har koi is platform se easily earn kar sakta hai. Recommended to everyone 🌸',
  },
  {
    name: 'Shoaib Latif',
    avatar_url: 'https://i.postimg.cc/WzKKJsbv/c49e128382f1d0b59192354bda2e6900.jpg',
    content: 'Sab se best baat ye hai ke aap ko kisi ki منتیں nahi karni parti payment ke liye. Time per aap ko payment mil jati hai. Is se acha aur kya chahiye.',
  },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-3xl">
            <MessageSquare className="h-8 w-8 text-primary" />
            Customer Reviews
          </CardTitle>
          <CardDescription>
            See what our users are saying about their experience with ProAssignment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staticReviews && staticReviews.length > 0 ? (
            <div className="space-y-6">
              {staticReviews.map((review, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="p-6">
                    <blockquote className="border-l-4 border-primary pl-4">
                      <p className="text-lg italic text-foreground">
                        “{review.content}”
                      </p>
                    </blockquote>
                    <div className="mt-4 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/50">
                            <AvatarImage src={review.avatar_url || ''} alt={review.name} data-ai-hint="user avatar" />
                            <AvatarFallback>
                                {review.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <cite className="text-md not-italic font-semibold text-foreground">
                          {review.name}
                        </cite>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                <p className="text-center text-muted-foreground">
                    No reviews have been added yet.
                    <br />
                    Check back soon to see what our users think!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
