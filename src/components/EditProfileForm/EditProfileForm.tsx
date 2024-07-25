import React from 'react';
import style from './EditProfileForm.module.scss';
import { getToken, updateCurrentUser } from '../../store/reducer/blogSlice';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/hooks';

type ProfileInputForm = {
    email: string;
    username: string;
    password: string;
    avatar: string;
};

const EditProfileForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = getToken();

    const onSubmit = (data: ProfileInputForm) => {
        dispatch(
            updateCurrentUser({
                token: token,
                userData: {
                    email: data.email.toLowerCase(),
                    username: data.username,
                    password: data.password,
                    image: data.avatar
                }
            })
        );
        reset();
    };

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset
    } = useForm<ProfileInputForm>({
        mode: 'onBlur'
    });

    return (
        <div className={style.form}>
            <h2 className={style.formTitle}>Edit Profile</h2>
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
                    New password
                    <input
                        {...register('password', {
                            required: 'field is required',
                            minLength: {
                                value: 6,
                                message: 'password length must be > 6  characters'
                            },
                            maxLength: {
                                value: 40,
                                message: 'password length must be < 40 characters'
                            }
                        })}
                        id="password"
                        type="password"
                        placeholder="New password"
                    />
                </label>
                <div className={style.error}>
                    {errors?.password && <p>{errors?.password?.message?.toString() || 'error'}</p>}
                </div>

                <label htmlFor="avatar">
                    Avatar image(url)
                    <input
                        {...register('avatar', {
                            pattern: {
                                value: /^http[s]?:\/\/[a-zA-Z\d.-]+[:]?[\d]{0,4}[/]?[a-zA-Z\d/-]+./,
                                message: 'avatar must be correct url'
                            }
                        })}
                        id="avatar"
                        type="url"
                        placeholder="Avatar image"
                    />
                </label>
                <div className={style.error}>
                    {errors?.avatar && <p>{errors?.avatar?.message?.toString() || 'error'}</p>}
                </div>

                <input
                    type="submit"
                    disabled={!isValid}
                    className={isValid ? style.validButton : style.invalidButton}
                    value="Save"
                />
            </form>
        </div>
    );
};
export default EditProfileForm;
