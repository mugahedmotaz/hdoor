import React from 'react';
import { Play, Star } from 'lucide-react';

interface ImageTestimonialProps {
 imageUrl: string;
 videoUrl: string;
 title: string;
 subtitle: string;
 quote: string;
 author: string;
 role: string;
}

const ImageTestimonial = ({
 imageUrl,
 videoUrl,
 title,
 subtitle,
 quote,
 author,
 role
}: ImageTestimonialProps) => {
 return (
  <div className="group relative">
   <div className="relative aspect-video rounded-2xl overflow-hidden shadow-elegant">
    <img
     src={imageUrl}
     alt={title}
     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
     <div className="absolute bottom-4 left-4 right-4">
      <a
       href={videoUrl}
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full hover:bg-white transition-colors"
      >
       <Play className="w-4 h-4 text-primary" />
       <span className="text-sm font-medium">شاهد الفيديو</span>
      </a>
     </div>
    </div>
   </div>

   <div className="mt-6 text-right">
    <div className="flex items-center gap-1 mb-2">
     {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
     ))}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{subtitle}</p>
    <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
    <div>
     <div className="font-semibold">{author}</div>
     <div className="text-sm text-muted-foreground">{role}</div>
    </div>
   </div>
  </div>
 );
};

export default ImageTestimonial;
