import React from 'react';
import SafeFallback from './SafeFallback.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <SafeFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
