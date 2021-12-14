import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { EVariant } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost = () => {
  const [, createPost] = useCreatePostMutation();
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  const onCreatePostClick = () => async (values: any) => {
    const { error } = await createPost({ options: values });
    if (!error) router.push('/');
  };

  useEffect(() => {
    const notLoggedInUser = !fetching && !data?.auth?.id;
    if (notLoggedInUser) router.replace('/login');
  }, [data, router, fetching]);

  return (
    <Layout variant={EVariant.SMALL}>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={onCreatePostClick()}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <InputField
                name='title'
                placeholder='Post title'
                label='Post title'
              />
            </Box>
            <Box mb={2}>
              <InputField
                name='text'
                placeholder='Text...'
                label='Post Text'
                textarea={true}
              />
            </Box>
            <Box mt={4}>
              <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>
                Create post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
