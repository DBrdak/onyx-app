import React, { Component, ReactNode } from "react";
import GlobalLoadingError from "@/components/GlobalLoadingError";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { fallback } = this.props;

    if (hasError) {
      return fallback || <GlobalLoadingError />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
