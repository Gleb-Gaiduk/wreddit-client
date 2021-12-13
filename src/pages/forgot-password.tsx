import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';
import { InputField } from '../components/InputField';
import { EVariant, Wrapper } from '../components/Wrapper';
import {
  MutationSendChangePasswordEmailArgs,
  useSendChangePasswordEmailMutation,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword = ({}) => {
  const [isRequestCompleted, setIsRequestCompleted] = useState<Boolean>(false);
  const [{}, sendChangePasswordEmail] = useSendChangePasswordEmailMutation();

  const onSendClick =
    () =>
    async ({ email }: MutationSendChangePasswordEmailArgs) => {
      await sendChangePasswordEmail({ email });
      setIsRequestCompleted(true);
    };

  return (
    <Wrapper variant={EVariant.SMALL}>
      <Formik initialValues={{ email: '' }} onSubmit={onSendClick()}>
        {({ isSubmitting }) =>
          isRequestCompleted ? (
            <Box>
              If an account with that email exists, we will sent you password
              reset email
            </Box>
          ) : (
            <Form>
              <Box mb={2}>
                <InputField name='email' placeholder='Email' label='Email' />
              </Box>

              <Box mt={4}>
                <Button
                  type='submit'
                  colorScheme='teal'
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

// SSR is turned off here, withUrqlClient HOC allows mutations
export default withUrqlClient(createUrqlClient)(ForgotPassword);
