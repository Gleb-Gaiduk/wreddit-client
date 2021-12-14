import React, { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { EVariant, Wrapper } from './Wrapper';

type TLayoutProps = {
  variant?: EVariant;
  children: ReactNode;
};

export const Layout = ({
  children,
  variant = EVariant.REGULAR,
}: TLayoutProps) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>;
    </>
  );
};
