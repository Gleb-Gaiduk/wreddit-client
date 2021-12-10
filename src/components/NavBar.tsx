import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

type TNavBarProps = {};

export const NavBar = ({}: TNavBarProps) => {
  return (
    <Flex bg='tomato' p={4}>
      <Box ml={'auto'}>
        <NextLink href='/login'>
          <Link mr={2} color={'white'}>
            Login
          </Link>
        </NextLink>

        <NextLink href='/register'>
          <Link color={'white'}>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};
