import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-[var(--bug-report)]">
          <h2>Something went wrong in AdvancedSettings.</h2>
          <p>{this.state.error?.message || "An unknown error occurred."}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-4 bg-[var(--features-icon-color)] text-white px-4 py-2 rounded hover:bg-[var(--hover-color)]"
          >
            Try Again
          </button>
          {this.state.errorInfo && (
            <details className="mt-4 text-gray-700">
              <summary>Stack Trace</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;