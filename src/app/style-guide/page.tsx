import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-display font-medium text-brand-charcoal">
        {title}
      </h2>
      {children}
    </section>
  );
}

const palette = [
  { name: "Charcoal", token: "bg-brand-charcoal", hex: "#222222", light: true },
  { name: "Rose", token: "bg-brand-rose", hex: "#D8A6A6", light: false },
  { name: "Gray", token: "bg-brand-gray", hex: "#A6A6A6", light: false },
  { name: "Beige", token: "bg-brand-beige", hex: "#E6DED6", light: false },
  { name: "Off-white", token: "bg-brand-off-white", hex: "#F7F3F1", light: false },
] as const;

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-brand-off-white px-6 py-12 md:px-16">
      <div className="mx-auto max-w-3xl space-y-14">
        <PageHeader
          title="Design System"
          subtitle="Paleta de cores, tipografia e componentes base da plataforma FM Personal Online."
        />

        {/* Cores */}
        <Section title="Paleta de Cores">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {palette.map((color) => (
              <div key={color.name} className="space-y-2">
                <div
                  className={`h-16 w-full rounded-lg border border-brand-beige ${color.token}`}
                />
                <p className="text-xs font-sans font-medium text-brand-charcoal">
                  {color.name}
                </p>
                <p className="text-xs font-sans text-brand-gray">{color.hex}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Tipografia */}
        <Section title="Tipografia">
          <Card>
            <CardBody className="space-y-6">
              <div>
                <p className="mb-1 text-xs font-sans uppercase tracking-wide text-brand-gray">
                  Playfair Display — display / títulos
                </p>
                <p className="font-display text-3xl text-brand-charcoal">
                  Resultados que transformam
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-sans uppercase tracking-wide text-brand-gray">
                  Montserrat — corpo / UI
                </p>
                <p className="font-sans text-base text-brand-charcoal">
                  Consultoria online de treino com acompanhamento personalizado.
                </p>
              </div>
              <div className="space-y-2 border-t border-brand-beige pt-4">
                <p className="font-display text-3xl font-semibold text-brand-charcoal">Título h1</p>
                <p className="font-display text-xl font-medium text-brand-charcoal">Título h2</p>
                <p className="font-sans text-base font-medium text-brand-charcoal">Subtítulo</p>
                <p className="font-sans text-sm text-brand-charcoal">Texto de corpo padrão</p>
                <p className="font-sans text-xs uppercase tracking-wide text-brand-gray">
                  Label / caption
                </p>
              </div>
            </CardBody>
          </Card>
        </Section>

        {/* Botões */}
        <Section title="Botões">
          <Card>
            <CardBody className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-sans uppercase tracking-wide text-brand-gray">
                  Variantes
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-sans uppercase tracking-wide text-brand-gray">
                  Tamanhos
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-sans uppercase tracking-wide text-brand-gray">
                  Desabilitado
                </p>
                <Button disabled>Desabilitado</Button>
              </div>
            </CardBody>
          </Card>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <p className="font-display text-base font-medium text-brand-charcoal">
                  Card simples
                </p>
              </CardHeader>
              <CardBody>
                <p className="text-sm font-sans text-brand-gray">
                  Conteúdo do card com padding padrão e borda sutil.
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <p className="font-display text-base font-medium text-brand-charcoal">
                  Com rodapé
                </p>
              </CardHeader>
              <CardBody>
                <p className="text-sm font-sans text-brand-gray">
                  Card com header, body e footer separados por bordas finas.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Ver mais
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <Card>
            <CardBody className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" type="text" placeholder="Ex.: Ana Lima" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="ana@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="disabled">Desabilitado</Label>
                <Input id="disabled" type="text" placeholder="Campo desabilitado" disabled />
              </div>
            </CardBody>
          </Card>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Ativo</Badge>
                <Badge variant="rose">Destaque</Badge>
                <Badge variant="gray">Inativo</Badge>
                <Badge variant="beige">Pendente</Badge>
              </div>
            </CardBody>
          </Card>
        </Section>
      </div>
    </div>
  );
}
