import MetaRow from './MetaRow';

export default function PostCard({ post }) {
  return (
    <article className="rounded-2xl bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] border-2 border-[#c29d5d]/20 shadow-lg overflow-hidden sm:grid sm:grid-cols-[120px_1fr] md:grid-cols-[160px_1fr]">
      <img src={post.cover} alt={post.title} className="w-full aspect-[16/9] object-cover sm:aspect-auto sm:w-[120px] sm:h-full md:w-[160px]" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#e7c27d] hover:underline cursor-pointer">
          {post.title}
        </h3>
        <MetaRow author={post.author} date={post.date} reads={post.reads} comments={post.comments} />
        <p className="mt-2 text-sm text-gray-200 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
