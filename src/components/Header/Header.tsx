import React, { useEffect, useState } from 'react';
import style from './Header.module.scss';
import { Link } from 'react-router-dom';
import { getCurrentUser, getToken, logOut } from '../../store/reducer/blogSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import avatar from '../../assets/img.png';
import { _basePath, newArticle, profile, signIn, signUp } from '../../constants';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.blogReducer.user);
    const authorized = useAppSelector((state) => state.blogReducer.authorized);

    const { username, image } = user;
    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        const token = getToken();
        if (token) {
            dispatch(getCurrentUser(token));
        }
        setUserImage(image ? image : avatar);
    }, [authorized, dispatch, image]);

    return (
        <header className={style.header}>
            <Link to={_basePath} className={style.title}>
                Realworld Blog
            </Link>
            {authorized ? (
                <div className={style.authorisation}>
                    <Link to={newArticle}>
                        <button className={style.createArticle}>Create article</button>
                    </Link>
                    <Link to={profile}>
                        <div className={style.username}>{username}</div>
                    </Link>
                    <Link to={profile}>
                        <img
                            src={userImage}
                            alt="avatar"
                            className={style.photo}
                            onError={(err) => {
                                console.log(err);
                                setUserImage(avatar);
                            }}
                        />
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
                    <Link to={signIn}>
                        <button className={style.signIn}>Sign in</button>
                    </Link>
                    <Link to={signUp}>
                        <button className={style.signUp}>Sign Up</button>
                    </Link>
                </div>
            )}
        </header>
    );
};
export default Header;
