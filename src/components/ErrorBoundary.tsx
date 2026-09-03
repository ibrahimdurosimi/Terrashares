import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F8E8] dark:bg-[#111] p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#171717] rounded-3xl p-8 shadow-2xl border border-black/5 dark:border-white/10 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#171717] dark:text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              The application encountered an unexpected error while loading. Click below to reload the page.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 bg-gray-50 dark:bg-black/30 rounded-xl text-left overflow-x-auto text-xs font-mono text-red-600 dark:text-red-400 border border-black/5 dark:border-white/5">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#9ABA1B] text-[#171717] font-bold shadow-lg hover:bg-[#85A316] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
