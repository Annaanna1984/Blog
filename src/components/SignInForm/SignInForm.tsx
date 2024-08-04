import React, { useState } from 'react';
import style from './SignInForm.module.scss';
import { Link } from 'react-router-dom';
import { fetchUser } from '../../store/reducer/blogSlice';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/hooks';
import { Alert } from 'antd';
import { signUp } from '../../constants';

type SignInInputForm = {
    email: string;
    password: string;
};

const SignInForm = () => {
    const [error, setError] = useState(false);
    const dispatch = useAppDispatch();

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset
    } = useForm<SignInInputForm>({
        mode: 'onBlur'
    });

    const onSubmit = (data: SignInInputForm) => {
        dispatch(fetchUser({ email: data.email.toLowerCase(), password: data.password })).then((e) => {
            if (e.meta.requestStatus === 'rejected') {
                setError(true);
            }
            reset();
        });
    };

    return (
        <>
            {error && (
                <Alert message={'Invalid email or password'} showIcon={true} type={'error'} className={style.alert} />
            )}
            <div className={style.form}>
                <h2 className={style.formTitle}>Sign In</h2>
                <form className={style.forma} onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="email">
                        Email address
                        <input
                            {...register('email', {
                                required: 'field is required',
                                pattern: {
                                    value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
                                    message: 'email must be correct email'
                                }
                            })}
                            id="email"
                            type="email"
                            placeholder="Email address"
                        />
                    </label>
                    <div className={style.error}>
                        {errors?.email && <p>{errors?.email?.message?.toString() || 'error'}</p>}
                    </div>
                    <label htmlFor="password">
                        Password
                        <input
                            {...register('password', {
                                required: 'field is required'
                            })}
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                    </label>
                    <div className={style.error}>
                        {errors?.password && <p>{errors?.password?.message?.toString() || 'error'}</p>}
                    </div>
                    <input
                        type="submit"
                        disabled={!isValid}
                        value="Login"
                        className={isValid ? style.validButton : style.invalidButton}
                    />
                    <div className={style.already}>
                        Don&apos;t have an account? <Link to={signUp}>Sign Up.</Link>
                    </div>
                </form>
            </div>
        </>
    );
};
export default SignInForm;
