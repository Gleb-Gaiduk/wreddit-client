import { Link } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  // Finished on 3.58
  return (
    <Layout>
      <Link href={''}>
        <NextLink href='/create-post'>Create post</NextLink>
      </Link>

      {data ? (
        data.posts.map(post => <div key={post.id}>{post.title}</div>)
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
