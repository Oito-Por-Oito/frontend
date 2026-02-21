import MetaRow from './MetaRow';

export default function PostHero({ post }) {
  if (!post) return null;
  return (
    <article className="rounded-2xl bg-gradient-to-br from-surface-secondary via-surface-card to-surface-secondary border-2 border-gold/30 shadow-xl overflow-hidden">
      <img src={post.cover} alt={post.title} className="w-full aspect-[16/9] object-cover" />
      <div className="p-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gold-light drop-shadow mb-2">{post.title}</h2>
        <MetaRow author={post.author} date={post.date} reads={post.reads} comments={post.comments} />
        <p className="mt-3 text-base text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
