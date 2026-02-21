import MetaRow from './MetaRow';

export default function PostHero({ post }) {
  if (!post) return null;
  return (
    <article className="rounded-2xl bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] border-2 border-[#c29d5d]/30 shadow-xl overflow-hidden">
      <img src={post.cover} alt={post.title} className="w-full aspect-[16/9] object-cover" />
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[#e7c27d] drop-shadow mb-2">{post.title}</h2>
        <MetaRow author={post.author} date={post.date} reads={post.reads} comments={post.comments} />
        <p className="mt-3 text-base text-gray-200">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
