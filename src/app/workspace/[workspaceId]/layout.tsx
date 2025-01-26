"use client";

import { Toolbar } from "./toolbar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full bg-red-500">
      <Toolbar />
      {children}
    </div>
  );
};

export default WorkspaceLayout;
