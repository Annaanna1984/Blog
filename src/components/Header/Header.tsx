import React, { useEffect } from 'react';
import style from './Header.module.scss';
import { Link } from 'react-router-dom';
import { getCurrentUser, getToken, logOut } from '../../store/reducer/blogSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.blogReducer.user);
    console.log(user);
    const authorized = useAppSelector((state) => state.blogReducer.authorized);
    console.log(`#### Header.tsx authorized = ${authorized}`);

    const { username, image } = user;
    console.log(`#### Header.tsx image = ${image}`);

    useEffect(() => {
        const token = getToken();
        if (token) {
            dispatch(getCurrentUser(token));
        }
    }, [authorized, dispatch]);

    return (
        <header className={style.header}>
            <Link to="/" className={style.title}>
                Realworld Blog
            </Link>
            {authorized ? (
                <div className={style.authorisation}>
                    <Link to={`/new-article`}>
                        <button className={style.createArticle}>Create article</button>
                    </Link>
                    <Link to={`/profile`}>
                        <div className={style.username}>{username}</div>
                    </Link>
                    <Link to={`/profile`}>
                        <img className={style.photo} alt={'avatar'} src={image} />
                    </Link>
                    <button
                        className={style.logOut}
                        onClick={() => {
                            dispatch(logOut());
                        }}
                    >
                        {' '}
                        Log Out
                    </button>
                </div>
            ) : (
                <div className={style.authorisation}>
                    <Link to={`/sign-in`}>
                        <button className={style.signIn}>Sign in</button>
                    </Link>
                    <Link to={`/sign-up`}>
                        <button className={style.signUp}>Sign Up</button>
                    </Link>
                </div>
            )}
        </header>
    );
};
export default Header;
