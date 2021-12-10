import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { ReactNode } from 'react';
import { useMeQuery } from '../generated/graphql';

type TNavBarProps = {};

export const NavBar = ({}: TNavBarProps) => {
  const [{ fetching, data }] = useMeQuery();

  let body: ReactNode | null = null;

  if (fetching) {
    // Do smth while fetching
  } else if (data?.auth) {
    // User is logged in
    body = (
      <Flex>
        <Box mr={4}>{data.auth.username}</Box>
        <Button variant='link'>Logout</Button>
      </Flex>
    );
  } else {
    // User is not logged in
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2} color={'white'}>
            Login
          </Link>
        </NextLink>

        <NextLink href='/register'>
          <Link color={'white'}>Register</Link>
        </NextLink>
      </>
    );
  }

  return (
    <Flex bg='tomato' p={4}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
