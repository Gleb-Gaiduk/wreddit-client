import { Button } from '@chakra-ui/react';
import { Form, Formik, useFormik } from 'formik';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';
import {
  useRegisterMutation,
  UsernamePasswordInput,
} from '../generated/graphql';

type TRegisterProps = {};

const Register = ({}: TRegisterProps) => {
  const [{}, register] = useRegisterMutation();

  const onRegisterClick =
    () =>
    async (
      values: UsernamePasswordInput,
      { setErrors }: ReturnType<typeof useFormik>
    ) => {
      const res = await register(values);
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
