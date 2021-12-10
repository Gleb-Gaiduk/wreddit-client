import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';

type TRegisterProps = {};

const REGISTER_MUTATION = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password}) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;

const Register = ({}: TRegisterProps) => {
  const [{}, register] = useMutation(REGISTER_MUTATION);

  return (
    <Wrapper variant={EVariant.SMALL}>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={values => register(values)}
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
