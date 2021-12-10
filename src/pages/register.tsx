import { Button } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';
import {
  useRegisterMutation,
  UsernamePasswordInput,
} from '../generated/graphql';
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
      const res = await register(values);
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
        initialValues={{ username: '', password: '' }}
        onSubmit={onRegisterClick()}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='User name'
              label='User name'
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
