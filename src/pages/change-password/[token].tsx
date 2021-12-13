import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import { EVariant, Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  const onResetClick =
    () =>
    async (
      values: { newPassword: string },
      { setErrors }: FormikHelpers<{ newPassword: string }>
    ) => {
      const payload = {
        newPassword: values.newPassword,
        token: typeof token === 'string' ? token : '',
      };

      const res = await changePassword(payload);
      const serverValidationErrors = res.data?.changePassword.errors;
      const user = res.data?.changePassword.user;

      if (serverValidationErrors) {
        const errorMap = toErrorMap(serverValidationErrors);
        console.log('errorMap', errorMap);

        if ('token' in errorMap) {
          setTokenError(errorMap['token']);
        }

        setErrors(errorMap);
      } else if (user) {
        router.push('/');
      }
      return res;
    };

  return (
    <Wrapper variant={EVariant.SMALL}>
      <Formik initialValues={{ newPassword: '' }} onSubmit={onResetClick()}>
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='New password'
              label='New password'
              type='password'
            />
            {tokenError ? (
              <Flex>
                <Box mr={2} color='red'>
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>
                  <Link>click to get a new token</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              type='submit'
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              Reset
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
