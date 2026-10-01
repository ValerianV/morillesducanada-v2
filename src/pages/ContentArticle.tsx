import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTENT_LINK_LABELS, type ArticleBlock, type ArticleDef } from "@/lib/seo/articles";
import { articleSchema, breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";
import { FOUNDER_NAME } from "@/lib/seo/site";

const INLINE = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;

// Texte avec liens [libellé](/chemin) et gras **texte**.
function renderInline(text: string): ReactNode {
  return text.split(INLINE).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <Link key={i} to={link[2]} className="text-primary hover:text-gold-light underline underline-offset-4">
          {link[1]}
        </Link>
      );
    }
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={i} className="text-foreground">{bold[1]}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-lg text-foreground/85 leading-relaxed">{renderInline(block.text)}</p>;
    case "ul":
      return (
        <ul className="list-disc pl-6 space-y-2 text-lg text-foreground/85 leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal pl-6 space-y-2 text-lg text-foreground/85 leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-base border-collapse">
            <caption className="text-left text-sm text-foreground/75 mb-2">{block.caption}</caption>
            <thead>
              <tr className="border-b border-gold/30">
                {block.head.map((h) => (
                  <th key={h} scope="col" className="text-left font-medium text-foreground py-2 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-gold/10 align-top">
                  {row.map((cell, i) => (
                    <td key={i} className={`py-2 pr-4 ${i === 0 ? "text-foreground" : "text-foreground/85"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

const dateFr = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const ContentArticle = ({ article }: { article: ArticleDef }) => (
  <div className="min-h-screen bg-background">
    <Seo
      title={article.metaTitle}
      description={article.metaDescription}
      path={article.path}
      type="article"
      jsonLd={[
        articleSchema({
          path: article.path,
          headline: article.h1,
          description: article.metaDescription,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          keywords: article.keywords,
        }),
        faqPageSchema(article.sections.map((s) => ({ q: s.q, a: s.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "") }))),
        breadcrumbSchema([{ name: article.h1, path: article.path }]),
      ]}
    />
    <Navbar />

    <main className="pt-28 pb-20">
      <article className="container mx-auto px-5 sm:px-6 max-w-3xl">
        <Link to="/professionnels" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-10 text-sm tracking-wider uppercase">
          <ArrowLeft className="w-4 h-4" /> Tarifs et devis
        </Link>

        <header className="mb-12">
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4">{article.eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-6">{article.h1}</h1>
          <p className="text-xl text-foreground leading-relaxed">{renderInline(article.lead)}</p>
          <p className="mt-6 text-sm text-foreground/75">
            Par {FOUNDER_NAME}, fondateur de Morilles du Canada et ancien cueilleur (trois saisons, de 2022 à 2024, en
            Colombie-Britannique et au Yukon). Mis à jour le{" "}
            <time dateTime={article.dateModified}>{dateFr(article.dateModified)}</time>.
          </p>
          <nav aria-label="Sommaire" className="mt-8 p-5 border border-gold/15 rounded-sm bg-card/40">
            <p className="text-sm tracking-[0.2em] uppercase text-foreground/70 mb-3">Dans cette page</p>
            <ol className="space-y-1.5 text-base">
              {article.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-foreground/85 hover:text-primary">
                    {s.q}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {article.sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-12 scroll-mt-28">
            <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">{section.q}</h2>
            <div className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed font-medium">{renderInline(section.answer)}</p>
              {section.blocks?.map((block, i) => <Block key={i} block={block} />)}
            </div>
          </section>
        ))}

        <aside className="mt-16 p-8 bg-gradient-card rounded-sm border border-primary/10 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-3">Commander ou demander un devis</h2>
          <p className="text-foreground/85 mb-6 max-w-lg mx-auto">
            Morilles de feu sauvages du Canada, entières et équeutées, au kilo pour les professionnels, en stock en France.
            Vente réservée aux professionnels : SIRET demandé à la commande.
          </p>
          <Link
            to="/professionnels"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm rounded-sm hover:bg-primary/90 transition-colors"
          >
            Tarifs et devis
          </Link>
        </aside>

        <section className="mt-12" aria-labelledby="related-title">
          <h2 id="related-title" className="font-serif text-xl mb-4">À lire aussi</h2>
          <ul className="space-y-2 text-lg">
            {article.related.map((path) => (
              <li key={path}>
                <Link to={path} className="text-primary hover:text-gold-light underline underline-offset-4">
                  {CONTENT_LINK_LABELS[path] ?? path}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>

    <Footer />
  </div>
);

export default ContentArticle;
