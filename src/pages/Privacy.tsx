import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { contactInfo } from '@/data/content';

const operator = 'ИП Киргизова Анастасия Владимировна';
const inn = '772585008234';
const ogrnip = '324774600026339';
const email = contactInfo.email;

const Privacy = () => {
  return (
    <Layout>
      <SEO
        title="Политика конфиденциальности | White Friday PC"
        description="Политика обработки персональных данных White Friday PC."
        path="/privacy"
        noindex
      />
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Документы</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold">
            ПОЛИТИКА <span className="text-primary text-glow-cyan">КОНФИДЕНЦИАЛЬНОСТИ</span>
          </h1>
        </div>
      </section>

      <section className="container py-10 md:py-14 max-w-3xl">
        <div className="prose-legal space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-sm">Дата публикации: 20 июля 2026 г.</p>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика обработки персональных данных (далее — «Политика») действует в отношении
              всей информации, которую {operator} (далее — «Оператор») может получить о пользователе во время
              использования сайта. Политика разработана в соответствии с Федеральным законом от 27.07.2006
              № 152-ФЗ «О персональных данных».
            </p>
            <p className="mt-3">
              Использование сайта означает согласие пользователя с настоящей Политикой и условиями обработки
              его персональных данных. В случае несогласия с условиями пользователю следует воздержаться
              от использования сайта.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">2. Оператор персональных данных</h2>
            <ul className="list-none space-y-1">
              <li>Наименование: {operator}</li>
              <li>ИНН: {inn}</li>
              <li>ОГРНИП: {ogrnip}</li>
              <li>E-mail для обращений: {email}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">3. Какие данные мы собираем</h2>
            <p>Оператор обрабатывает следующие персональные данные, которые пользователь предоставляет добровольно при отправке заявки:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>фамилия, имя;</li>
              <li>номер телефона;</li>
              <li>никнейм в Telegram (при указании);</li>
              <li>адрес электронной почты (при указании);</li>
              <li>содержание сообщения и параметры желаемой конфигурации ПК.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">4. Цели обработки</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>обработка заявок и связь с пользователем;</li>
              <li>консультирование, подбор конфигурации и оформление заказа;</li>
              <li>информирование о статусе заказа и услугах Оператора.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">5. Правовые основания</h2>
            <p>
              Обработка персональных данных осуществляется на основании согласия пользователя, а также
              в целях исполнения договора, стороной которого является пользователь.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">6. Условия обработки и передачи</h2>
            <p>
              Оператор не передаёт персональные данные третьим лицам, за исключением случаев, предусмотренных
              законодательством РФ, а также случаев, когда это необходимо для исполнения заказа (например,
              службам доставки). Оператор принимает необходимые организационные и технические меры для защиты
              персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">7. Сроки хранения</h2>
            <p>
              Персональные данные хранятся не дольше, чем этого требуют цели их обработки, либо до отзыва
              пользователем согласия на обработку.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">8. Права пользователя</h2>
            <p>
              Пользователь вправе получать информацию об обработке своих персональных данных, требовать их
              уточнения, блокирования или уничтожения, а также отозвать согласие на обработку, направив
              обращение на e-mail: {email}.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl uppercase tracking-wide text-foreground mb-3">9. Изменение Политики</h2>
            <p>
              Оператор вправе вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента
              её размещения на сайте.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;