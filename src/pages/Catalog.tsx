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

  useEffect(() => {
    fetchBuilds()
      .then((list) => {
        setBuilds(list.length > 0 ? apiToBuilds(list) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="grid-bg border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <p className="text-secondary font-display uppercase tracking-widest text-sm mb-2">Каталог</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold">НАШИ <span className="text-primary text-glow-cyan">СБОРКИ</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Готовые конфигурации под любые задачи — от киберспорта до 3D-рендеринга.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Icon name="LoaderCircle" size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
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