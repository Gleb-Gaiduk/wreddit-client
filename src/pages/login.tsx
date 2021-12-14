import { Box, Button, Link } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';
import { MutationLoginArgs, useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

const Login = ({}) => {
  const [{}, login] = useLoginMutation();
  const router = useRouter();

  const onRegisterClick =
    () =>
    async (
      values: MutationLoginArgs,
      { setErrors }: FormikHelpers<MutationLoginArgs>
    ) => {
      const res = await login(values);
      const serverValidationErrors = res.data?.login.errors;
      const user = res.data?.login.user;

      if (serverValidationErrors) {
        setErrors(toErrorMap(serverValidationErrors));
      } else if (user) {
        if (typeof router.query.next === 'string') {
          router.push(router.query.next);
        } else {
          router.push('/');
        }
      }
      return res;
    };

  return (
    <Wrapper variant={EVariant.SMALL}>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={onRegisterClick()}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <InputField
                name='usernameOrEmail'
                placeholder='User name or email'
                label='User name or email'
              />
            </Box>
            <Box mb={2}>
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
              />
            </Box>
            <NextLink href='/forgot-password'>
              <Link>Forgot password?</Link>
            </NextLink>
            <Box mt={4}>
              <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// SSR is turned off here, withUrqlClient HOC allows mutations
export default withUrqlClient(createUrqlClient)(Login);
