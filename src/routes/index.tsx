import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Layers,
  Calculator,
  Package,
  MessageCircle,
  FileText,
  Zap,
  Check,
  ShieldCheck,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHECKOUT_URL, buildCheckoutUrl } from "@/lib/checkout";
import { startUtmifyPixel } from "@/lib/utmify-pixel";
import { startUtmify } from "@/lib/utmify";
import { PixelPrivacy } from "@/components/PixelPrivacy";
import { OfferPrice } from "@/components/OfferPrice";
import { OFFER, formatOfferPrice } from "@/lib/offer";
import heroVideo from "@/assets/panetone-preparo.mp4.asset.json";

const TITLE = "Kit Encomendas de Natal — Panetones que Vendem | 15 receitas";
const DESCRIPTION = `15 receitas de panetones recheados, massa passo a passo, técnicas de montagem, custos e divulgação. Kit digital em PDF de ${formatOfferPrice(OFFER.regularPrice)} por ${formatOfferPrice(OFFER.promotionalPrice)}.`;
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

type AssetPointer = { url: string };
const recipePhotos = import.meta.glob<AssetPointer>("../assets/cardapio-webp/*.webp.asset.json", {
  eager: true,
  import: "default",
});
const photoFor = (n: number) => {
  const prefix = `../assets/cardapio-webp/${String(n).padStart(2, "0")}-`;
  const key = Object.keys(recipePhotos).find((k) => k.startsWith(prefix));
  return key ? (recipePhotos[key]?.url ?? "") : "";
};

type Tier = "ent" | "car" | "pre";
const TIER_LABEL: Record<Tier, string> = { ent: "Entrada", car: "Carro-chefe", pre: "Premium" };

/** The final section holds the only button that leaves for checkout; every other CTA scrolls here. */
const OFFER_ID = "comprar";
const CRIATIVO_FOTOS = [1, 7, 12, 15];

const RECEITAS: { nome: string; tier: Tier }[] = [
  { nome: "Panetone de Chocolate Branco com Frutas Vermelhas", tier: "ent" },
  { nome: "Panetone de Banoffee", tier: "ent" },
  { nome: "Panetone de Romeu e Julieta", tier: "ent" },
  { nome: "Panetone de Tiramisù", tier: "car" },
  { nome: "Panetone de Churros", tier: "car" },
  { nome: "Panetone de Cookies and Cream", tier: "car" },
  { nome: "Panetone de Pistache", tier: "car" },
  { nome: "Panetone de Morango com Creme Ninho", tier: "car" },
  { nome: "Panetone de Mousse de Limão Siciliano", tier: "ent" },
  { nome: "Panetone de Maracujá Cremoso", tier: "car" },
  { nome: "Panetone de Chocolate com Laranja", tier: "pre" },
  { nome: "Panetone de Prestígio", tier: "pre" },
  { nome: "Panetone de Doce de Leite com Nozes", tier: "pre" },
  { nome: "Panetone de Ninho com Creme de Avelã", tier: "pre" },
  { nome: "Panetone de Brigadeiro Cremoso", tier: "pre" },
];

const BENEFITS = [
  "15 receitas completas de panetones recheados.",
  "Massa base explicada passo a passo.",
  "3 técnicas de montagem e recheio.",
  "Dicas de embalagens e conservação.",
  "Planilha para calcular custos e preços.",
  "Mensagens prontas para divulgar pelo WhatsApp.",
];
const INCLUDED = [
  { icon: BookOpen, title: "15 receitas completas", text: "Ingredientes e modo de preparo para variar seu cardápio." },
  { icon: ChefHat, title: "Massa base passo a passo", text: "Da escolha dos ingredientes ao preparo da massa." },
  {
    icon: Layers,
    title: "3 técnicas de recheio e montagem",
    text: "Orientações para montar seus panetones recheados.",
  },
  {
    icon: Calculator,
    title: "Planilha de custos e precificação",
    text: "Organize os custos e calcule o preço dos seus panetones.",
  },
  { icon: Package, title: "Embalagem e conservação", text: "Cuidados para apresentar e conservar cada receita." },
  {
    icon: MessageCircle,
    title: "Mensagens para WhatsApp",
    text: "Textos prontos para divulgar e organizar encomendas.",
  },
];
const FAQ = [
  {
    q: "Como recebo o material?",
    a: "O acesso ao material é liberado após a confirmação da compra. Siga as instruções apresentadas pela plataforma de pagamento para acessar seu PDF.",
  },
  { q: "O produto é físico ou digital?", a: "É um material digital em PDF. Nenhum produto físico é enviado." },
  {
    q: "Preciso ter experiência com confeitaria?",
    a: "Não. A massa base é explicada passo a passo, com receitas e orientações para quem está começando.",
  },
  {
    q: "Quantas receitas estão incluídas?",
    a: "São 15 receitas de panetones recheados, além dos materiais complementares de montagem, embalagem, custos e divulgação.",
  },
  {
    q: "Posso acessar pelo celular?",
    a: "Sim. Você pode ler o PDF no celular, tablet ou computador com um leitor de PDF.",
  },
  {
    q: "O pagamento é feito em ambiente seguro?",
    a: "O botão direciona para o checkout externo da Celetus por uma conexão HTTPS. As opções de pagamento e condições são apresentadas lá; esta página não coleta seus dados de pagamento.",
  },
];

export function Index() {
  const [checkout, setCheckout] = useState(CHECKOUT_URL);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const respectMotion = () => {
      if (motion.matches) videoRef.current?.pause();
    };
    respectMotion();
    motion.addEventListener("change", respectMotion);
    return () => motion.removeEventListener("change", respectMotion);
  }, []);
  useEffect(() => {
    setCheckout(buildCheckoutUrl(window.location.search));
  }, []);
  useEffect(() => startUtmifyPixel(), []);
  useEffect(() => startUtmify(), []);
  // Buttons above the offer only walk the visitor down to the final button.
  const scrollToOffer = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(OFFER_ID);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    target.querySelector<HTMLAnchorElement>("a.cta")?.focus({ preventScroll: true });
  };
  const cta = (text: ReactNode = "QUERO MEU KIT AGORA!") => (
    <Button asChild variant="sales" className="cta">
      <a href={`#${OFFER_ID}`} onClick={scrollToOffer}>
        <span className="cta-label">{text}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </a>
    </Button>
  );
  const ctaCheckout = (text: ReactNode = "QUERO MEU KIT AGORA!") => (
    <Button asChild variant="sales" className="cta cta-salto">
      <a href={checkout}>
        <span className="cta-label">{text}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </a>
    </Button>
  );

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <div className="kicker">🎄 GUIA DE PRODUÇÃO E VENDA — NATAL 2026</div>
            <p className="product-name">Kit Encomendas de Natal · Panetones que Vendem</p>
            <h1>Aprenda a Fazer 15 Panetones Recheados para o Natal!</h1>
            <p className="sub">
              Receitas completas, técnicas de recheio e orientações para você preparar seus panetones e organizar suas
              encomendas, mesmo começando do zero.
            </p>
            <ul className="hero-benefits">
              {BENEFITS.map((text) => (
                <li key={text}>
                  <Check size={18} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
            <p className="hero-price">Acesso ao material completo: Por R$19,90</p>{" "}
            {cta(
              <>
                QUERO ACESSAR AS 15 RECEITAS — <OfferPrice />
              </>,
            )}
            <div className="nota">
              <span>
                <FileText size={16} aria-hidden="true" />
                Material digital em PDF
              </span>
              <span>
                <Zap size={16} aria-hidden="true" />
                Acesso após a confirmação da compra
              </span>
            </div>
          </div>
          <div className="ill hero-video-wrap">
            <video
              ref={videoRef}
              src={heroVideo.url}
              className="hero-ill hero-video"
              width={720}
              height={1280}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Vídeo de panetone"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
            />
            <Button
              variant="secondary"
              size="icon"
              className="hero-video-toggle"
              aria-label={videoPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              title={videoPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                if (video.paused) void video.play().catch(() => setVideoPlaying(false));
                else video.pause();
              }}
            >
              {videoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="galeria-sec">
          <div className="wrap">
            <div className="kicker">Um Natal com mais sabor</div>
            <h2>Conheça alguns dos 15 sabores que você vai aprender!</h2>
            <div className="galeria">
              {[15, 7, 2, 5, 1, 4].map((n) => {
                const recipe = RECEITAS[n - 1];
                if (!recipe) return null;
                return (
                  <figure key={n}>
                    <img src={photoFor(n)} width={640} height={640} loading="lazy" alt={recipe.nome} />
                    <figcaption>{recipe.nome.replace("Panetone de ", "")}</figcaption>
                  </figure>
                );
              })}
            </div>
            <p className="gallery-caption">E esses são apenas alguns dos 15 sabores disponíveis no material!</p>
          </div>
        </section>
        <section className="sec creme">
          <div className="wrap">
            <div className="kicker">Seu kit completo</div>
            <h2>Muito mais que um simples livro de receitas!</h2>
            <div className="dentro">
              {INCLUDED.map(({ icon: Icon, title, text }) => (
                <div className="item" key={title}>
                  <div className="ico">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <b>{title}</b>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-cta">
              {cta()}
              <p>
                15 receitas + materiais complementares · <OfferPrice />
              </p>
            </div>
          </div>
        </section>
        <section className="sec">
          <div className="wrap">
            <div className="kicker">O cardápio completo</div>
            <h2>15 panetones recheados para o seu cardápio</h2>
            <p className="lead">
              Combinações clássicas e especiais para você escolher os sabores das suas encomendas de Natal.
            </p>
            <ul className="rcs">
              {RECEITAS.map((r, i) => (
                <li className="rc" key={r.nome}>
                  <div className="rc-svg">
                    <img src={photoFor(i + 1)} alt={r.nome} width={640} height={640} loading="lazy" />
                  </div>
                  <span className="rc-n">{String(i + 1).padStart(2, "0")}</span>
                  <b>{r.nome}</b>
                  <span className={`tag t-${r.tier}`}>{TIER_LABEL[r.tier]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="sec creme">
          <div className="wrap duo">
            <div>
              <div className="kicker">Para quem é</div>
              <h2>Seu próximo cardápio começa aqui</h2>
              <ul className="check">
                <li>Para quem cozinha em casa e quer começar a fazer encomendas</li>
                <li>Para confeiteiras que querem ampliar o cardápio de Natal</li>
                <li>Para quem quer organizar custos, apresentação e divulgação</li>
              </ul>
            </div>
            <div>
              <div className="kicker">Do preparo à encomenda</div>
              <h2>Receitas e organização no mesmo kit</h2>
              <p className="lead">
                Prepare a massa, escolha o recheio e cuide da apresentação. Depois, organize seus custos e divulgue seus
                sabores com as mensagens do material.
              </p>
            </div>
          </div>
        </section>
        <section className="sec oferta" id="oferta">
          <div className="wrap offer-layout">
            <div>
              <div className="kicker">Seu cardápio de Natal</div>
              <h2>Tenha acesso às 15 receitas e prepare seu cardápio de Natal!</h2>
              <p className="offer-product">Kit Encomendas de Natal</p>
              <p>
                Panetones que Vendem
                <br />
                15 receitas recheadas + materiais complementares.
              </p>
              <ul className="check">
                <li>Massa base e técnicas de montagem</li>
                <li>Custos, embalagem e conservação</li>
                <li>Mensagens para divulgar pelo WhatsApp</li>
              </ul>
            </div>
            <div className="offer-action">
              <div className="preco">
                <OfferPrice />
              </div>
              <div className="preco-nota">pagamento único</div>
              {cta()}
              <p className="offer-note">
                Material digital em PDF.
                <br />
                Acesso após a confirmação da compra.
              </p>
              <p className="checkout-note">
                <ShieldCheck size={18} aria-hidden="true" />
                Pagamento no checkout da Celetus
              </p>
            </div>
          </div>
        </section>
        <section className="sec faq">
          <div className="wrap faq-wrap">
            <div className="kicker">Antes de começar</div>
            <h2>Perguntas frequentes</h2>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="sec final" id={OFFER_ID}>
          <div className="wrap">
            <h2>Escolha os sabores do seu Natal</h2>
            <p>As 15 receitas e os materiais para organizar suas encomendas, reunidos em um só kit digital.</p>
            {ctaCheckout(
              <>
                QUERO MEU KIT AGORA — <OfferPrice />
                !!!!
              </>,
            )}
            <div className="criativo">
              <div className="criativo-fotos">
                {CRIATIVO_FOTOS.map((n) => (
                  <img
                    key={n}
                    src={photoFor(n)}
                    width={320}
                    height={320}
                    loading="lazy"
                    alt={RECEITAS[n - 1]?.nome ?? "Panetone recheado"}
                  />
                ))}
              </div>
              <div className="criativo-preco">
                <div>
                  <span>Kit Encomendas de Natal</span>
                  <small>15 receitas + materiais complementares</small>
                </div>
              </div>
              <p className="criativo-nota">Material digital em PDF · acesso após a confirmação da compra</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="rodape">
        <div className="wrap">
          <p>Kit Encomendas de Natal — Panetones que Vendem</p>
          <PixelPrivacy />
        </div>
      </footer>
      <div className="cta-fixo">
        {cta(
          <>
            Quero meu kit — <OfferPrice />
          </>,
        )}
      </div>
    </>
  );
}
