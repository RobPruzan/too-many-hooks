"use client";
import { Fragment, startTransition, use, useMemo } from "react";
import { useEffect, useState } from "react";
import { Suspense, Component } from "react";

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

export default function Page() {
  const [promise, setTrigger] = useState<Promise<any> | null>(null);
  const _ = promise ? use(promise) : promise;
  useMemo(() => {}, []);
  return (
    <Fragment>
      <Redirect setTrigger={setTrigger} />
      <ClientSuspense>
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>
      </ClientSuspense>
    </Fragment>
  );
}

const Bomb = () => {
  throw new Error("boom");
  return <div>hi</div>;
};

const Redirect = ({
  setTrigger,
}: {
  setTrigger: (promise: Promise<any>) => void;
}) => {
  const [state, setState] = useState<string>("v1");

  const dispatchPromise = () => {
    console.log("dispatch promise");

    startTransition(() => {
      let resolver: (value: any) => void;
      let promise = new Promise((res) => {
        resolver = res;
      });
      setTrigger(promise);
      setTimeout(() => {
        resolver("hi");
      }, 100);
    });
  };

  useEffect(() => {
    setState("/versions/v2");
  }, []);

  useEffect(() => {
    // this works
    // setTimeout(() => {
    //   dispatchPromise();
    // });
    dispatchPromise();
  }, [state]);

  return null;
};
