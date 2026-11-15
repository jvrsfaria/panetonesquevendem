import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { CHECKOUT_URL, buildCheckoutUrl } from "@/lib/checkout";
import { startMetaPixel } from "@/lib/meta-pixel";
import { PixelPrivacy } from "@/components/PixelPrivacy";
import heroImg from "@/assets/hero-panetone-chocolate.jpg.asset.json";
import galFatia from "@/assets/galeria-fatia.jpg.asset.json";
import galNozes from "@/assets/galeria-nozes.jpg.asset.json";
import galChocBranco from "@/assets/galeria-chocolate-branco.jpg.asset.json";
import galEmbalado from "@/assets/galeria-embalado.jpg.asset.json";

const TITLE = "Panetones que Vendem · 15 receitas recheadas para lucrar no Natal";
const DESCRIPTION =
  "Guia de produção e venda de panetones artesanais: 15 receitas recheadas, embalagem, precificação e scripts de venda. R$ 19,90.";

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
const recipePhotos = import.meta.glob<AssetPointer>("../assets/cardapio/*.jpg.asset.json", {
  eager: true,
  import: "default",
});
const photoFor = (n: number) => {
  const prefix = `../assets/cardapio/${String(n).padStart(2, "0")}-`;
  const key = Object.keys(recipePhotos).find((k) => k.startsWith(prefix));
  return key ? (recipePhotos[key]?.url ?? "") : "";
};

type Tier = "ent" | "car" | "pre";
const TIER_LABEL: Record<Tier, string> = { ent: "Entrada", car: "Carro-chefe", pre: "Premium" };

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

const PARTES = [
  {
    n: "PARTE 1",
    t: "Produção",
    d: "Ingredientes, equipamentos, a massa clássica passo a passo, a massa de chocolate, recheios, coberturas e os erros mais comuns.",
  },
  {
    n: "PARTE 2",
    t: "As 15 receitas",
    d: "Do banoffee ao brigadeiro cremoso, cada uma com ficha completa, ponto de atenção, validade e dica de venda.",
  },
  {
    n: "PARTE 3",
    t: "Apresentação",
    d: "Três níveis de embalagem, fotos que dão água na boca com o celular, validade e o que vai na etiqueta.",
  },
  {
    n: "PARTE 4",
    t: "Venda",
    d: "Custo real, preço com margem, onde vender, scripts prontos e como organizar a produção em escala.",
  },
];

function Ico({ children }: { children: ReactNode }) {
  return (
    <div className="ico">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="30"
        height="30"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </div>
  );
}

const EXTRAS: { icon: ReactNode; t: string; d: string }[] = [
  {
    icon: (
      <>
        <path d="M8 18l16 -8 16 8v18l-16 8 -16 -8z" />
        <path d="M8 18l16 8 16 -8M24 26v18" />
      </>
    ),
    t: "Embalagem que vende",
    d: "Três níveis para três faixas de preço.",
  },
  {
    icon: (
      <>
        <rect x="6" y="14" width="36" height="24" rx="3" />
        <circle cx="24" cy="26" r="7" />
        <path d="M17 14l3 -5h8l3 5" />
      </>
    ),
    t: "Fotos com celular",
    d: "A montagem com luz de janela e a foto da fatia que vende sozinha.",
  },
  {
    icon: (
      <>
        <circle cx="24" cy="24" r="16" />
        <path d="M28 18q-4 -3 -8 0t0 6 8 6 0 6 -8 0M24 13v4M24 31v4" />
      </>
    ),
    t: "Custo e preço",
    d: "A fórmula da margem, com um exemplo resolvido passo a passo.",
  },
  {
    icon: <path d="M8 12h32v20H20l-8 7v-7H8z" />,
    t: "Scripts de venda",
    d: "Lançamento, follow-up, fechamento, empresas e pós-venda.",
  },
  {
    icon: (
      <>
        <rect x="8" y="10" width="32" height="30" rx="3" />
        <path d="M8 18h32M16 6v8M32 6v8" />
      </>
    ),
    t: "Plano de produção",
    d: "Capacidade do forno, semana típica e organização das entregas.",
  },
  {
    icon: (
      <>
        <rect x="12" y="6" width="24" height="36" rx="3" />
        <path d="M12 20h24M17 12v4M17 25v6" />
      </>
    ),
    t: "Validade e etiqueta",
    d: "Quanto tempo cada recheio dura e o que a etiqueta precisa informar.",
  },
];

const DEPOIMENTOS = [
  {
    q: "Eu sempre quis fazer panetones para vender, mas tinha dificuldade em encontrar receitas realmente bonitas e com acabamento profissional. O material me surpreendeu! As receitas são muito bem explicadas e as ideias de sabores são incríveis.",
    a: "Mariana O.",
  },
  {
    q: "O que mais gostei foi a variedade de receitas. São opções que realmente chamam a atenção e ajudam a montar um cardápio diferenciado para o Natal. Valeu muito a pena!",
    a: "Camila R.",
  },
  {
    q: "Achei o e-book muito completo! Gostei especialmente da apresentação das receitas e das combinações de sabores. Já estou planejando meu cardápio de Natal e o material está me ajudando bastante.",
    a: "Fernanda C.",
  },
];

const FAQ = [
  {
    q: "Preciso ter experiência com panetone?",
    a: "Não. O capítulo 3 explica a massa passo a passo, com o teste do véu e dois cronogramas. A receita mais simples entre as recheadas é indicada para a sua primeira fornada de teste.",
  },
  {
    q: "Como recebo o e-book?",
    a: "Logo depois da confirmação do pagamento, a Kirvano envia o acesso para o seu e-mail. Você baixa o PDF e lê no celular, no tablet ou no computador.",
  },
  {
    q: "Preciso de batedeira planetária?",
    a: "Não. Uma batedeira com gancho resolve. O capítulo 2 lista o mínimo para começar e o que ajuda quando o volume cresce.",
  },
  {
    q: "As receitas usam fermento natural?",
    a: "Não. Todas usam fermento biológico seco pelo método esponja, que é mais previsível para quem está começando. A fermentação natural aparece como próximo nível.",
  },
  {
    q: "O livro ensina a calcular o preço?",
    a: "Sim. A Parte 4 mostra como somar ingredientes, embalagem, gás e a sua hora de trabalho, e como aplicar a margem. Cada receita tem um quadro de custo para você preencher.",
  },
  {
    q: "Posso vender os panetones que fizer?",
    a: "Sim, esse é o objetivo do guia. O capítulo 9 orienta sobre validade, etiqueta e a consulta à vigilância sanitária do seu município.",
  },
];

function useCheckoutUrl() {
  const [url, setUrl] = useState(CHECKOUT_URL);
  useEffect(() => {
    setUrl(buildCheckoutUrl(window.location.search));
  }, []);
  return url;
}

function Index() {
  const checkout = useCheckoutUrl();
  useEffect(() => startMetaPixel(), []);
  const cta = (
    <a className="cta" href={checkout}>
      Quero o meu por R$ 19,90
    </a>
  );

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div>
            <div className="kicker">Guia de produção e venda · Natal 2026</div>
            <h1>Panetones que Vendem</h1>
            <p className="sub">
              15 receitas recheadas para fazer, apresentar e lucrar neste Natal, mesmo começando do zero.
            </p>
            <ul>
              <li>Uma massa base que vira 15 produtos diferentes</li>
              <li>Embalagem, fotos com celular e etiqueta</li>
              <li>Como calcular o custo e definir o preço com lucro</li>
              <li>Mensagens prontas para vender pelo WhatsApp</li>
            </ul>
            {cta}
            <div className="nota">E-book em PDF · Acesso imediato após a compra · Feito para ler no celular</div>
          </div>
          <div className="ill">
            <img
              src={heroImg.url}
              className="hero-ill hero-photo"
              width={800}
              height={1000}
              alt="Panetone com cobertura de chocolate"
              fetchPriority="high"
            />
          </div>
        </div>
      </header>

      <main>
        <section className="galeria-sec">
          <div className="wrap">
            <h2>O tipo de panetone que você vai aprender a fazer</h2>
            <div className="galeria">
              <img src={galFatia.url} width={600} height={600} loading="lazy" alt="Fatia de panetone caseiro" />
              <img src={galNozes.url} width={600} height={600} loading="lazy" alt="Panetone cortado com nozes" />
              <img
                src={galChocBranco.url}
                width={600}
                height={600}
                loading="lazy"
                alt="Panetone com chocolate branco"
              />
              <img
                src={galEmbalado.url}
                width={600}
                height={600}
                loading="lazy"
                alt="Panetone embalado para presente"
              />
            </div>
            <div className="galeria-nota">Imagens ilustrativas</div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="kicker">Não é só um livro de receitas</div>
            <h2>Do primeiro panetone à última entrega do dia 24</h2>
            <p className="lead">
              O Natal é a época em que todo mundo procura panetone, para a ceia, para presentear e para levar ao
              trabalho. Este guia mostra como produzir com padrão, apresentar com cara de loja e cobrar um preço que
              paga o seu trabalho.
            </p>
            <div className="grid4">
              {PARTES.map((p) => (
                <div className="card" key={p.n}>
                  <div className="num">{p.n}</div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec creme">
          <div className="wrap">
            <div className="kicker">O cardápio completo</div>
            <h2>15 panetones recheados para o seu cardápio</h2>
            <p className="lead">
              Todos partem de duas massas e de oito recheios base. Você aprende uma técnica e varia, sem precisar
              dominar quinze receitas diferentes.
            </p>
            <ul className="rcs">
              {RECEITAS.map((r, i) => (
                <li className="rc" key={r.nome}>
                  <div className="rc-svg">
                    <img src={photoFor(i + 1)} alt={r.nome} width={400} height={400} loading="lazy" />
                  </div>
                  <span className="rc-n">{String(i + 1).padStart(2, "0")}</span>
                  <b>{r.nome}</b>
                  <span className={`tag t-${r.tier}`}>{TIER_LABEL[r.tier]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec">
          <div className="wrap duo">
            <div>
              <div className="kicker">Para quem é</div>
              <h2>Feito para você que…</h2>
              <ul className="check">
                <li>Já cozinha em casa e quer uma renda extra no fim de ano</li>
                <li>É confeiteira e quer acrescentar panetone ao cardápio</li>
                <li>Já faz panetone, mas não sabe quanto lucra em cada um</li>
                <li>Quer presentear com algo feito à mão e com cara de loja</li>
              </ul>
            </div>
            <div>
              <div className="kicker">O que vem dentro</div>
              <h2>Um guia completo</h2>
              <ul className="check">
                <li>139 páginas em formato pensado para o celular</li>
                <li>Fichas com rendimento, tempo, nível e validade</li>
                <li>Plano de 6 semanas até a ceia</li>
                <li>Tabela de custo, checklist, lista de compras e calendário de dezembro</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="sec creme">
          <div className="wrap">
            <div className="kicker">Além das receitas</div>
            <h2>Tudo o que vem depois do forno</h2>
            <div className="dentro">
              {EXTRAS.map((e) => (
                <div className="item" key={e.t}>
                  <Ico>{e.icon}</Ico>
                  <div>
                    <b>{e.t}</b>
                    <span>{e.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="kicker">Quem já leu</div>
            <h2>O que as primeiras leitoras disseram</h2>
            <div className="depo">
              {DEPOIMENTOS.map((d) => (
                <figure key={d.a}>
                  <blockquote>{d.q}</blockquote>
                  <figcaption>{d.a}</figcaption>
                </figure>
              ))}
            </div>
            <p className="depo-nota">Opiniões de leitoras que conheceram o material antes do lançamento.</p>
          </div>
        </section>

        <section className="sec oferta" id="oferta">
          <div className="wrap">
            <div className="box">
              <div className="kicker">Acesso imediato</div>
              <h2>Panetones que Vendem</h2>
              <div className="preco">
                <small>R$</small>19,90
              </div>
              <div className="preco-nota">pagamento único</div>
              <ul className="check">
                <li>E-book completo em PDF, 139 páginas</li>
                <li>15 receitas recheadas com ficha técnica</li>
                <li>Guia de embalagem, preço e venda</li>
                <li>Tabelas e checklists para imprimir</li>
              </ul>
              {cta}
              <div className="bump"></div>
              <div className="garantia">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="34"
                  height="34"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="24" cy="24" r="17" />
                  <path d="M16 24l6 6 11 -12" />
                </svg>
                <span>
                  <b>7 dias de garantia.</b> Se o guia não for para você, peça o reembolso pela Kirvano em até 7 dias
                  após a compra.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="sec faq">
          <div className="wrap faq-wrap">
            <div className="kicker">Dúvidas</div>
            <h2>Perguntas frequentes</h2>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sec final">
          <div className="wrap">
            <h2>O Natal já começou nas encomendas</h2>
            <p>
              Quem se organiza em novembro chega a dezembro com o cardápio pronto, o preço calculado e os primeiros
              pedidos fechados.
            </p>
            {cta}
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="wrap">
          Panetones que Vendem · Vitta Digital · Pagamento processado pela Kirvano
          <PixelPrivacy />
        </div>
      </footer>
      <div className="cta-fixo">
        <a className="cta" href="#oferta">
          Garantir o meu por R$ 19,90
        </a>
      </div>
    </>
  );
}
