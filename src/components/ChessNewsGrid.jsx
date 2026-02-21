import React, { memo } from 'react';
import { motion } from "framer-motion";
import { Card, Badge, Button } from '@/components/ui';

const newsItems = [
  {
    title: "Humpy Wins On Demand, Advances To All-Indian Final",
    image: "https://images.chesscomfiles.com/uploads/v1/news/1732304.fca0db19.507x286o.5eb38d7a6f9a.png",
    author: "AnthonyLevin",
    tag: "NM",
  },
  {
    title: "Fedoseev Edges Out Aravindh On Tiebreaks To Win Biel Masters",
    image: "https://images.chesscomfiles.com/uploads/v1/news/1732480.a06d3a3f.507x286o.b44b9e5ecba7.png",
    author: "PeterDoggers",
    tag: null,
  },
  {
    title: "Yes, You Can Use The Engine To Improve—And Other Tips From A Data-Focused Coach",
    image: "https://images.chesscomfiles.com/uploads/v1/article/32210.36ebf22b.507x286o.33177f6dd4e2.png",
    author: "NathanielGreen",
    tag: "FM",
  },
  {
    title: "Rare Fourth Moves",
    image: "https://images.chesscomfiles.com/uploads/v1/video/9851.202e2ac5.507x286o.8bdc6c84f09d.png",
    author: "JanistanTV",
    tag: "GM",
  },
];

const NewsCard = memo(({ item }) => (
  <Card 
    variant="bordered" 
    className="p-2 md:p-3 hover:scale-[1.025] transition-all duration-200"
  >
    <img
      src={item.image}
      alt={item.title}
      loading="lazy"
      decoding="async"
      className="rounded-md w-full object-cover border border-gold/20 shadow"
    />
    <p className="text-base mt-3 font-semibold text-white">{item.title}</p>
    <p className="text-sm text-text-secondary mt-1 flex items-center gap-2">
      {item.tag && <Badge variant={item.tag.toLowerCase()}>{item.tag}</Badge>}
      {item.author}
    </p>
  </Card>
));

NewsCard.displayName = 'NewsCard';

const ChessNewsGrid = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Card variant="gradient" className="max-w-4xl w-full mx-auto p-4 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gold-light drop-shadow">
          Follow what's happening in Chess Today.
        </h2>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
          {newsItems.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button variant="primary" size="md">
            Chess Today
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});

ChessNewsGrid.displayName = 'ChessNewsGrid';

export default ChessNewsGrid;
