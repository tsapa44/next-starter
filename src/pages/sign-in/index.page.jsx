import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';

import { path } from 'pages/routes';

import useHandleError from 'hooks/useHandleError';
import { userActions, userSelectors } from 'resources/user/user.slice';

import Input from 'components/Input';
import Button from 'components/Button';
import Link from 'components/Link';
import MemoCard from 'components/MemoCard';

import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import styles from './styles.module.css';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
  password: yup.string().required('Field is required.'),
});

const SignIn = () => {
  const router = useRouter();
  const handleError = useHandleError();
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const {
    handleSubmit, formState: { errors }, setError, control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) router.push(path.home);
  }, [router, user]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await dispatch(userActions.signIn(data));
    } catch (e) {
      handleError(e, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className={styles.container}>
        <h2>Sign In</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Input
            name="email"
            label="Email Address"
            placeholder="Email"
            control={control}
            error={errors.email}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            control={control}
            error={errors.password}
          />
          <Button
            className={styles.button}
            loading={loading}
            htmlType="submit"
          >
            Sign in
          </Button>
          <div className={styles.description}>
            <div>
              Don’t have an account?
              <Link
                type="router"
                href={path.signUp}
                className={styles.signUplink}
              >
                Sign up
              </Link>
            </div>
            <Link
              type="router"
              href={path.forgotPassword}
              className={styles.forgotPasswordLink}
            >
              Forgot password?
            </Link>
          </div>
        </form>
        <MemoCard items={errors.credentials} />
      </div>
    </>
  );
};

export default SignIn;
