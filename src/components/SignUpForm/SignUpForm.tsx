import React, { useState } from 'react';
import style from './SignUpForm.module.scss';
import { Link } from 'react-router-dom';
import { fetchRegister } from '../../store/reducer/blogSlice';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { Alert } from 'antd';

type SignUpInputForm = {
    email: string;
    password: string;
    repeat: string;
    username: string;
    checkbox: boolean;
};

const SignUpForm = () => {
    const [registerErrors, setRegisterErrors] = useState<string[]>([]);
    const dispatch = useAppDispatch();

    const onSubmit = (data: SignUpInputForm) => {
        dispatch(fetchRegister({ email: data.email, password: data.password, username: data.username })).then((e) => {
            if (e.meta.requestStatus === 'rejected') {
                const errs: string[] = [];
                if (e.payload?.email) {
                    errs.push('Email is already taken!');
                }
                if (e.payload?.username) {
                    errs.push('Username is already taken!');
                }
                setRegisterErrors(errs);
            }
            reset();
        });
    };

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset,
        watch
    } = useForm<SignUpInputForm>({
        mode: 'onBlur'
    });

    return (
        <>
            {registerErrors.length > 0 && (
                <Alert message={registerErrors.join('\n')} type={'error'} showIcon={true} className={style.alert} />
            )}
            <div className={style.form}>
                <h2 className={style.formTitle}>Create new account</h2>

                <form className={style.forma} onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="username">
                        Username
                        <input
                            {...register('username', {
                                required: 'field is required',
                                minLength: {
                                    value: 3,
                                    message: 'username length must be > 3 characters'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'username length must be < 20 characters'
                                },
                                pattern: {
                                    value: /^[a-z][a-z0-9]*$/,
                                    message: 'You can only use lowercase English letters and numbers'
                                }
                            })}
                            id="username"
                            type="username"
                            placeholder="Username"
                        />
                    </label>
                    <div className={style.error}>
                        {errors?.username && <p>{errors?.username?.message?.toString() || 'error'}</p>}
                    </div>
                    <label htmlFor="email">
                        Email address
                        <input
                            {...register('email', {
                                required: 'field is required',
                                pattern: {
                                    value: /[^@\s][^@\s]*@[^@\s]+\.[^@\s]+/,
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
                                required: 'field is required',
                                minLength: {
                                    value: 6,
                                    message: 'password length must be > 6 characters'
                                },
                                maxLength: {
                                    value: 40,
                                    message: 'password length must be < 40 characters'
                                }
                            })}
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                    </label>
                    <div className={style.error}>
                        {errors?.password && <p>{errors?.password?.message?.toString() || 'error'}</p>}
                    </div>

                    <label htmlFor="repeat">
                        Repeat password
                        <input
                            {...register('repeat', {
                                required: 'field is required',
                                minLength: {
                                    value: 4,
                                    message: 'repeat password length must be > 4 characters'
                                },
                                maxLength: {
                                    value: 40,
                                    message: 'repeat password length must be < 40 characters'
                                },
                                validate: (val: string) => {
                                    if (watch('password') !== val) {
                                        return 'Your passwords do no match';
                                    }
                                }
                            })}
                            id="repeat"
                            type="password"
                            placeholder="Repeat password"
                        />
                    </label>
                    <div className={style.error}>
                        {errors?.repeat && <p>{errors?.repeat?.message?.toString() || 'error'}</p>}
                    </div>

                    <label className={style.LabelCheck}>
                        <input
                            type="checkbox"
                            className={style.checkbox}
                            {...register('checkbox', {
                                required: {
                                    value: true,
                                    message: 'field is required'
                                }
                            })}
                        />
                        I agree to the processing of my personal information
                    </label>

                    <input
                        type="submit"
                        disabled={!isValid}
                        value="Create"
                        className={isValid ? style.validButton : style.invalidButton}
                    />
                    <div className={style.already}>
                        Already have an account?
                        <Link to={`/sign-in`}>Sign In.</Link>
                    </div>
                </form>
            </div>
        </>
    );
};
export default SignUpForm;
