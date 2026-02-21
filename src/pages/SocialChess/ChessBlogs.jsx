
import { useEffect, useState } from 'react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeaderBar from '../../components/ChessBlogs/HeaderBar';
import PostHero from '../../components/ChessBlogs/PostHero';
import PostCard from '../../components/ChessBlogs/PostCard';
import Sidebar from '../../components/ChessBlogs/Sidebar';

const MOCK_POSTS = [
	{
		id: 1,
		title: 'Playing Like a Rock Star',
		author: 'Kenleajazz',
		date: '9 de ago. de 2025',
		reads: 25,
		comments: 0,
		cover: '/assets/img/BlogTop.jpg',
		excerpt: "It's not often that you meet someone who can play chess and guitar at the same time...",
		featured: true,
	},
	{
		id: 2,
		title: 'Como melhorar no xadrez rápido',
		author: 'Ana Paula',
		date: '8 de ago. de 2025',
		reads: 40,
		comments: 2,
		cover: '/assets/img/Blog1.jpg',
		excerpt: 'Dicas práticas para evoluir no blitz e bullet. Veja como treinar tática e manter a calma sob pressão.',
		featured: false,
	},
	{
		id: 3,
		title: 'O segredo dos grandes mestres',
		author: 'GM Rafael',
		date: '7 de ago. de 2025',
		reads: 60,
		comments: 5,
		cover: '/assets/img/Blog2.jpg',
		excerpt: 'Você já se perguntou o que diferencia um GM dos demais? Descubra os hábitos e rotinas dos melhores.',
		featured: false,
	},
	{
		id: 4,
		title: 'Chess & Café: O ambiente ideal',
		author: 'Lucas Café',
		date: '6 de ago. de 2025',
		reads: 18,
		comments: 1,
		cover: '/assets/img/Blog3.png',
		excerpt: 'Como o ambiente influencia seu desempenho no tabuleiro. Experimente jogar em um café e sinta a diferença.',
		featured: false,
	},
	{
		id: 5,
		title: 'A importância dos finais',
		author: 'Prof. Júlia',
		date: '5 de ago. de 2025',
		reads: 33,
		comments: 0,
		cover: '/assets/img/Blog4.png',
		excerpt: 'Muitos jogadores ignoram os finais, mas eles decidem partidas. Veja como estudar finais pode elevar seu nível.',
		featured: false,
	},
];

export default function ChessBlogs() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch('/api/blogs?lang=pt');
				const json = await res.json();
				if (json.data && json.data.length > 0) {
					setPosts(json.data);
				} else {
					setPosts(MOCK_POSTS);
				}
			} catch (e) {
				setPosts(MOCK_POSTS);
			}
		})();
	}, []);

	const hero = posts.find(p => p.featured) || posts[0];
	const rest = posts.filter(p => !p.featured && p !== hero);

		return (
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
				<Navbar />
				<HeaderBar title="Blogs" />
				<main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
					{/* Coluna esquerda */}
					<section className="space-y-8">
						<PostHero post={hero} />
						{/* grid 2 colunas de cards */}
						<div className="grid md:grid-cols-2 gap-8">
							{rest.map(p => <PostCard key={p.id} post={p} />)}
						</div>
					</section>

					{/* Sidebar */}
					<aside className="space-y-8">
						<Sidebar />
					</aside>
				</main>
				<Footer />
			</div>
		);
}
