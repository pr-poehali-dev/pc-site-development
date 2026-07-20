import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

const operator = 'ИП Киргизова Анастасия Владимировна';
const inn = '772585008234';
const ogrnip = '324774600026339';

const Consent = () => {
  return (
    <Layout>
      <SEO
        title="Согласие на обработку персональных данных | White Friday PC"
        description="Согласие на обработку персональных данных White Friday PC."
        path="/consent"
        noindex
      />
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Документы</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold">
            СОГЛАСИЕ НА <span className="text-primary text-glow-cyan">ОБРАБОТКУ ДАННЫХ</span>
          </h1>
        </div>
      </section>

      <section className="container py-10 md:py-14 max-w-3xl">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Оставляя заявку на сайте, пользователь (далее — «Субъект персональных данных») даёт своё
            согласие {operator} (ИНН {inn}, ОГРНИП {ogrnip}) (далее — «Оператор») на обработку своих
            персональных данных на следующих условиях.
          </p>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">1. Перечень персональных данных</h2>
            <p>Согласие даётся на обработку следующих данных: фамилия, имя; номер телефона; никнейм в Telegram; адрес электронной почты; содержание сообщения и параметры желаемой конфигурации ПК.</p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">2. Цели обработки</h2>
            <p>Обработка персональных данных осуществляется в целях обработки заявки, связи с Субъектом, консультирования, подбора конфигурации, оформления и исполнения заказа.</p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">3. Перечень действий и способы обработки</h2>
            <p>Согласие даётся на совершение следующих действий: сбор, запись, систематизацию, накопление, хранение, уточнение, использование, передачу (при необходимости исполнения заказа), блокирование, удаление и уничтожение — как с использованием средств автоматизации, так и без них.</p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">4. Срок действия и отзыв согласия</h2>
            <p>Согласие действует с момента его предоставления и до достижения целей обработки либо до его отзыва. Согласие может быть отозвано Субъектом в любой момент путём направления письменного обращения Оператору.</p>
          </div>

          <p>
            Настоящее согласие связано с{' '}
            <Link to="/privacy" className="text-primary hover:underline">Политикой конфиденциальности</Link>{' '}
            Оператора, которую Субъект подтверждает, что прочитал и принял.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Consent;