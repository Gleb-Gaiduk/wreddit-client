import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { MouseEventHandler, useState } from 'react';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [paginationVariables, setPaginationVariables] = useState<{
    limit: number;
    cursor: string | null | undefined;
  }>({ limit: 10, cursor: null });

  const [{ data, fetching }] = usePostsQuery({
    variables: paginationVariables,
  });

  const onLoadMoreClick: MouseEventHandler<HTMLButtonElement> = (): void => {
    setPaginationVariables({
      limit: paginationVariables.limit,
      cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt,
    });
  };

  if (!fetching && !data) {
    return <div>You have no posts created</div>;
  }

  return (
    <Layout>
      <Link href={''}>
        <NextLink href='/create-post'>Create post</NextLink>
      </Link>

      {data ? (
        <>
          <Stack spacing={8}>
            {data.posts.posts.map(post => (
              <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                <UpdootSection post={post} />
                <Box>
                  <Heading fontSize='xl'>{post.title}</Heading>{' '}
                  <Text>created by {post.creator.username}</Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>

          {data.posts.hasMore ? (
            <Flex>
              <Button
                onClick={onLoadMoreClick}
                isLoading={fetching}
                m='auto'
                my={6}
              >
                Load more
              </Button>
            </Flex>
          ) : null}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
