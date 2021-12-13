import { Box, Button } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';
import {
  useRegisterMutation,
  UsernamePasswordInput,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

type TRegisterProps = {};

const Register = ({}: TRegisterProps) => {
  const [{}, register] = useRegisterMutation();
  const router = useRouter();

  const onRegisterClick =
    () =>
    async (
      values: UsernamePasswordInput,
      { setErrors }: FormikHelpers<UsernamePasswordInput>
    ) => {
      const res = await register({ options: values });
      const serverValidationErrors = res.data?.register.errors;
      const user = res.data?.register.user;

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
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={onRegisterClick()}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='User name'
              label='User name'
            />

            <Box mt={4}>
              <InputField name='email' placeholder='Email' label='Email' />
            </Box>

            <Box mt={4}>
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
              />
            </Box>

            <Button
              type='submit'
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
