import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import RootLayout from './layout';
import TemplateGenerator from './pages/generateTemplate/page';



const AppRouter = () => {
  return (
    <RootLayout>
      <TemplateGenerator />
    </RootLayout>
  );
}

export default AppRouter;