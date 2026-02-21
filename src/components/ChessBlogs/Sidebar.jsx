
function SectionCard({ title, right, children }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface-secondary via-surface-card to-surface-secondary border-2 border-gold/20 shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between border-b-2 border-gold/10">
        <h4 className="font-semibold text-gold-light">{title}</h4>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function Sidebar(){
  return (
    <>
      {/* Navegação */}
      <SectionCard title="Blogs" right={<span className="text-gold-light">▸</span>}>
        <ul className="text-sm">
          {['Todos os blogs','Melhores blogueiros','Meu blog','Meus Rascunhos','Configurações do Blog'].map(i=>(
            <li key={i}>
              <a className="block px-2 py-2 rounded hover:bg-gold/10 text-muted-foreground font-medium">{i}</a>
            </li>
          ))}
        </ul>
        <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-gold-light to-gold text-surface-primary font-bold py-2 shadow hover:from-gold-lighter hover:to-gold-light transition-all">Criar post</button>

        <div className="mt-3">
          <label className="text-sm text-gold-light font-semibold">Idioma</label>
          <select className="mt-1 w-full rounded bg-surface-secondary border border-gold/20 px-3 py-2 text-sm text-muted-foreground">
            <option>Inglês + meu idioma</option>
            <option>Apenas português</option>
          </select>
        </div>

        <div className="mt-3 relative">
          <input className="w-full rounded bg-surface-secondary border border-gold/20 pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground"
                 placeholder="Procurar Blogs..." />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-light">🔍</span>
        </div>
      </SectionCard>

      {/* CTA "Se aliste" */}
      <SectionCard title="Se aliste">
        <p className="text-sm text-muted-foreground">
          Escreva sobre xadrez e alcance um público maior. Participe do programa de Blogueiros.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Posts exibidos em /today e /blogs</li>
          <li>• Acesso ao clube oficial de Blogueiros</li>
        </ul>
        <button className="mt-4 rounded-xl bg-gradient-to-r from-gold-light to-gold text-surface-primary font-bold px-4 py-2 shadow hover:from-gold-lighter hover:to-gold-light transition-all">Aplicar</button>
      </SectionCard>
    </>
  );
}
