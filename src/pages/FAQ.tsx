import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { faq } from '@/data/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <Layout>
      <SEO
        title="Вопросы и ответы о сборке ПК — доставка, гарантия, оплата | White Friday PC"
        description="Ответы на частые вопросы: как заказать сборку ПК, сроки, доставка по России, гарантия до 3 лет, оплата, trade-in. Всё о работе White Friday PC."
        path="/faq"
        jsonLd={faqLd}
      />
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-xl md:text-3xl mb-2">FAQ</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">ВОПРОС — <span className="text-primary text-glow-cyan">ОТВЕТ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Собрали ответы на самые частые вопросы о сборках, доставке и гарантии.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border clip-corner px-6 animate-fade-up transition-all duration-300 data-[state=open]:border-glow-green data-[state=open]:bg-card/80" style={{ animationDelay: `${i * 0.06}s` }}>
              <AccordionTrigger className="font-display uppercase tracking-wide text-left text-base md:text-lg hover:text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line text-base md:text-lg">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 md:p-8 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 clip-corner">
          <h2 className="font-display text-2xl uppercase tracking-wide mb-3">Не нашли ответ?</h2>
          <p className="text-muted-foreground mb-6">Наши инженеры на связи с 11 до 22 по МСК и помогут с любым вопросом.</p>
          <Link to="/contacts" className="inline-flex items-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green">
            Задать вопрос <Icon name="MessageCircle" size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;