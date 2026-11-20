import { createFileRoute, Link } from "@tanstack/react-router";

const title = "Privacidade · Panetones que Vendem";
const description = "Informações sobre o pixel e as UTMs da UTMify e suas escolhas de privacidade no Panetones que Vendem.";
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
    <p className="mt-4">A página de vendas usa o pixel da UTMify para medir visitas, visualização da oferta e encaminhamento ao checkout. A UTMify recebe endereço da página, referência de origem, parâmetros de campanha, informações do navegador e dispositivo, endereço IP e identificadores publicitários, como _fbp e _fbc. Conforme a configuração do pixel na UTMify, esses dados podem ser encaminhados à Meta (Facebook e Instagram) para mensuração, atribuição, otimização de anúncios e públicos de remarketing.</p>
    <p className="mt-4">A instalação direta anterior do Meta Pixel foi removida. Os eventos e destinos do novo pixel são gerenciados pela UTMify. Esta página não possui formulários de dados pessoais nem confirma compras; encaminhar ao checkout não comprova pagamento. O pagamento acontece na Kiwify, que possui suas próprias regras de privacidade.</p>
    <h2 className="mt-8 text-xl font-semibold">Origem das visitas e UTMify</h2>
    <p className="mt-4">O script de UTMs da UTMify preserva parâmetros de campanha no navegador por até 7 dias e os acrescenta aos links, incluindo o checkout Kiwify, para identificar a origem das visitas. Ele é carregado somente quando a medição publicitária é permitida pelas escolhas e regras regionais abaixo. Não confirma compras nesta página.</p>
    <p className="mt-4">Ao recusar depois que o pixel ou o script de UTMs foi carregado, a página é recarregada para interromper sua execução. A recusa impede novos carregamentos; dados já recebidos pela UTMify ou encaminhados ao checkout não são apagados.</p>
    <h2 className="mt-8 text-xl font-semibold">Suas escolhas</h2>
    <p className="mt-4">Sem autorização publicitária registrada, o pixel não é carregado para visitantes da União Europeia e EEE, Reino Unido, Suíça e Canadá, nem quando a localização não puder ser confirmada. Nas demais regiões, pode funcionar até que você recuse. O sinal Global Privacy Control do navegador também impede a medição publicitária.</p>
    <p className="mt-4">Você pode recusar a qualquer momento pelo botão “Desativar cookies de publicidade” no rodapé da página de vendas. A recusa é salva neste navegador e interrompe novos envios, inclusive em outras abas abertas deste site. Ela não apaga dados já recebidos pela Meta; cookies existentes também podem ser removidos nas configurações do navegador.</p>
    <p className="mt-4">A contagem de visitas da plataforma de hospedagem é independente do pixel da UTMify. Consulte também a <a href="https://www.facebook.com/privacy/policy/" className="text-vinho underline" rel="noreferrer" target="_blank">Política de Privacidade da Meta</a>.</p>
  </main>;
}