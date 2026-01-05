'use client';

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
