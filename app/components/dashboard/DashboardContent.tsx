"use client";

import EmptyStore from "./EmptyStore";
import StoreDashboard from "./StoreDashboard";

interface DashboardContentProps {
  hasStore: boolean;
  onCreateStore: () => void;
}

export default function DashboardContent({
  hasStore,
  onCreateStore,
}: DashboardContentProps) {
  if (!hasStore) {
    return (
      <EmptyStore
        onCreateStore={onCreateStore}
      />
    );
  }

  return <StoreDashboard />;
}