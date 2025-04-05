import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private clearLocalStorageAndReload = () => {
    // Clear local storage - this can help with corrupted state
    localStorage.clear();
    sessionStorage.clear();
    // Reload the page
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              The application encountered an unexpected error. This might be due to a temporary network issue or a problem with your browser cache.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={this.handleReload} 
                className="w-full flex items-center justify-center"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload the application
              </Button>
              <Button 
                onClick={this.clearLocalStorageAndReload} 
                className="w-full flex items-center justify-center"
                variant="outline"
              >
                Reset and reload
              </Button>
            </div>
            {this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                  Technical details
                </summary>
                <p className="mt-2 text-red-600 dark:text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 