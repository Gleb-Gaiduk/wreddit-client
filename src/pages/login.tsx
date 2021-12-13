import { Button } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { withUrqlClient } from 'next-urql';
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
        router.push('/');
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
            <InputField
              name='usernameOrEmail'
              placeholder='User name or email'
              label='User name or email'
            />
            <InputField
              name='password'
              placeholder='Password'
              label='Password'
            />
            <Button
              type='submit'
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// SSR is turned off here, withUrqlClient HOC allows mutations
export default withUrqlClient(createUrqlClient)(Login);
