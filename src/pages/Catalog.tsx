import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { type Build } from '@/data/builds';
import { fetchBuilds } from '@/lib/buildsApi';
import { apiToBuilds } from '@/lib/buildsMap';
import CatalogCard from '@/components/CatalogCard';

const Catalog = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchBuilds()
      .then((list) => {
        setBuilds(list.length > 0 ? apiToBuilds(list) : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Каталог</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">НАШИ <span className="text-primary text-glow-cyan">ПРОЕКТЫ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Тут вы можете посмотреть заказы наших клиентов, выбрать подходящий для себя или же просто понять что вам подходит больше всего.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Icon name="LoaderCircle" size={28} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center gap-4 py-16">
            <div className="w-14 h-14 flex items-center justify-center bg-destructive/10 text-destructive clip-corner">
              <Icon name="WifiOff" size={28} />
            </div>
            <p className="font-display text-xl uppercase tracking-wide">Не удалось загрузить сборки</p>
            <p className="text-muted-foreground text-sm max-w-md">Проверьте соединение с интернетом и попробуйте ещё раз.</p>
            <button onClick={load} className="inline-flex items-center gap-2 px-6 py-3 btn-primary font-display uppercase tracking-wider clip-corner">
              <Icon name="RotateCw" size={18} /> Обновить
            </button>
          </div>
        ) : builds.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-16 text-muted-foreground">
            <Icon name="PackageOpen" size={40} />
            <p className="font-display text-lg uppercase tracking-wide">Сборок пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {builds.map((b, i) => (
              <CatalogCard key={b.id} build={b} index={i} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/contacts" className="inline-flex items-center gap-2 px-7 py-3.5 btn-primary font-display uppercase tracking-wider clip-corner">
            <Icon name="Wrench" size={18} /> Собрать индивидуальную конфигурацию
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;