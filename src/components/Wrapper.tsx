import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

export enum EVariant {
  SMALL = 'small',
  REGULAR = 'regular',
}

type TWrapperProps = {
  children: ReactNode;
  variant?: EVariant;
};

export const Wrapper = ({
  children,
  variant = EVariant.REGULAR,
}: TWrapperProps) => {
  return (
    <Box
      mt={8}
      mx='auto'
      maxW={variant === EVariant.REGULAR ? '800px' : '400px'}
      w='100%'
    >
      {children}
    </Box>
  );
};
