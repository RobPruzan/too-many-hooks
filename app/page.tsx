"use client";
import { Fragment, startTransition, use, useMemo } from "react";
import { useEffect, useState } from "react";
import { Suspense, Component } from "react";

export default function Entry() {
  return (
    // adding this suspense boundary fixes too many hooks problem
    // <Suspense>
    <Page />
    // </Suspense>
  );
}
function Page() {
  const [promise, setPromise] = useState<Promise<any> | null>(null);
  const _ = promise ? use(promise) : promise;
  useMemo(() => {}, []);
  return (
    <>
      <Redirect setPromise={setPromise} />
      <ClientSuspense>
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>
      </ClientSuspense>
    </>
  );
}

const Redirect = ({
  setPromise,
}: {
  setPromise: (promise: Promise<any>) => void;
}) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(true);
    startTransition(() => {
      setPromise(Promise.resolve());
    });
  }, [state]);

  return null;
};

const Bomb = () => {
  throw new Error("boom");
};

export const ClientSuspense = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div>loading</div>}>{children}</Suspense>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            Error: {this.state.error?.message || "Something went wrong."}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
