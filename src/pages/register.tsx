import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';

type TRegisterProps = {};

const Register = ({}: TRegisterProps) => {
  return (
    <Wrapper variant={EVariant.SMALL}>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={values => console.log(values)}
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
              variantColor='teal'
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
