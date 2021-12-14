import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { EVariant } from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost = () => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  const onCreatePostClick = () => async (values: any) => {
    const { error } = await createPost({ options: values });
    if (!error) router.push('/');
  };

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
