import { createFileRoute, Link } from "@tanstack/react-router";

const title = "Privacidade · Panetones que Vendem";
const description = "Informações sobre cookies publicitários, Meta Pixel e suas escolhas de privacidade.";
export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacy,
});
function Privacy() {
  return <main className="mx-auto max-w-3xl px-6 py-12 text-foreground">
    <Link to="/" className="text-vinho underline">Voltar para Panetones que Vendem</Link>
    <h1 className="mt-8 font-serif text-3xl">Privacidade</h1>
    <h2 className="mt-8 text-xl font-semibold">Medição publicitária</h2>
    <p className="mt-4">A página de vendas usa o Meta Pixel para enviar à Meta (Facebook e Instagram) o evento de visita à página (PageView). Ele pode compartilhar endereço da página, referência de origem, informações do navegador e dispositivo, endereço IP e identificadores de cookies, como _fbp e _fbc. A Meta pode usar esses dados para mensuração, atribuição, otimização de anúncios e públicos de remarketing, conforme suas próprias políticas.</p>
    <p className="mt-4">Esta instalação não envia dados de formulários para correspondência avançada e não confirma compras. O pagamento acontece na Celetus, que possui suas próprias regras de privacidade.</p>
    <h2 className="mt-8 text-xl font-semibold">Suas escolhas</h2>
    <p className="mt-4">Sem autorização publicitária registrada, o pixel não é carregado para visitantes da União Europeia e EEE, Reino Unido, Suíça e Canadá, nem quando a localização não puder ser confirmada. Nas demais regiões, pode funcionar até que você recuse. O sinal Global Privacy Control do navegador também impede a medição publicitária.</p>
    <p className="mt-4">Você pode recusar a qualquer momento pelo botão “Desativar cookies de publicidade” no rodapé da página de vendas. A recusa é salva neste navegador e interrompe novos envios, inclusive em outras abas abertas deste site. Ela não apaga dados já recebidos pela Meta; cookies existentes também podem ser removidos nas configurações do navegador.</p>
    <p className="mt-4">A contagem de visitas da plataforma de hospedagem é independente do Meta Pixel. Consulte também a <a href="https://www.facebook.com/privacy/policy/" className="text-vinho underline" rel="noreferrer" target="_blank">Política de Privacidade da Meta</a>.</p>
  </main>;
}