import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { ReactNode } from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

type TNavBarProps = {};

export const NavBar = ({}: TNavBarProps) => {
  // Request auth me on the client only but not on SSR
  const [{ fetching, data }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const onLogoutClick = () => () => {
    logout();
  };

  let body: ReactNode | null = null;

  if (fetching) {
    // Do smth while fetching
  } else if (data?.auth) {
    // User is logged in
    body = (
      <Flex>
        <Box mr={4}>{data.auth.username}</Box>
        <Button
          onClick={onLogoutClick()}
          isLoading={logoutFetching}
          disabled={logoutFetching}
          variant='link'
        >
          Logout
        </Button>
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
