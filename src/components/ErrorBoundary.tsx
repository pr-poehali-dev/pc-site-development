import { Component, type ReactNode } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('UI ErrorBoundary caught:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="flex flex-col items-center text-center gap-4 max-w-md">
            <div className="w-16 h-16 flex items-center justify-center bg-destructive/10 text-destructive clip-corner">
              <Icon name="TriangleAlert" size={32} />
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Что-то пошло не так</h1>
            <p className="text-muted-foreground text-sm">
              Произошла временная ошибка при отображении страницы. Попробуйте обновить — обычно это помогает.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 btn-primary font-display uppercase tracking-wider clip-corner btn-glow-green"
            >
              <Icon name="RotateCw" size={18} /> Обновить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
