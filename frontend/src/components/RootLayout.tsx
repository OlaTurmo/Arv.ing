import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopMenu } from './TopMenu';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopMenu />
      </div>
      <div className="pt-[64px]">
        <Outlet />
      </div>
    </div>
  );
}
