import React, { useState } from 'react';
import style from './Post.module.scss';
import Markdown from 'react-markdown';
import { Link, useHistory } from 'react-router-dom';
import { Popconfirm, PopconfirmProps } from 'antd';
import { addLike, Article, deleteArticle, deleteLike, getToken } from '../../store/reducer/blogSlice';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import avatar from '../../assets/img.png';
import { articles } from '../../constants';

interface PostProps {
    post: Article;
    fullText: boolean;
}

export const Post: React.FC<PostProps> = ({ ...props }) => {
    const dispatch = useAppDispatch();
    const token = getToken();
    const history = useHistory();
    const currentUser = useAppSelector((state) => state.blogReducer.user);

    const fullText = props.fullText;
    const { username, image } = props.post.author;
    const { tagList, body, title, favoritesCount, description, createdAt, slug, favorited } = props.post;
    const [userImage, setUserImage] = useState(image);

    const currentUserIsAuthor = username === currentUser.username;

    const formatDate = (createdAt: string): string => {
        const d = new Date(createdAt);
        const month = d.toLocaleString('en-US', { month: 'long' });
        return `${month} ${d.getDate()}, ${d.getFullYear()}`;
    };

    const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
        await dispatch(
            deleteArticle({
                token: token,
                slug: slug
            })
        );
        history.push('/');
    };

    const clickLike = () => {
        if (!token) return;
        dispatch(
            addLike({
                token: token,
                slug: slug
            })
        );
    };

    return (
        <div className={fullText ? style.postOpen : style.post}>
            <div>
                <div className={style.postTitle}>
                    <h2 className={style.title}>{title}</h2>
                    <div className={style.likesContainer}>
                        {favorited ? (
                            <HeartFilled
                                className={style.heartFilled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(
                                        deleteLike({
                                            token: token,
                                            slug: slug
                                        })
                                    );
                                }}
                            />
                        ) : (
                            <HeartOutlined
                                className={style.heartOutlined}
                                onClick={(e) => {
                                    e.preventDefault();
                                    clickLike();
                                }}
                            />
                        )}
                        <div className={style.likes}>{favoritesCount}</div>
                    </div>
                </div>
                {tagList
                    ?.filter((e: string) => e && e.trim().length > 0)
                    .map((e: string) => (
                        <div key={e} className={style.tags}>
                            {e}
                        </div>
                    ))}

                <div className={fullText ? style.descriptionOpen : style.description}>{description}</div>
                {fullText && <Markdown className={style.description}>{body}</Markdown>}
            </div>

            <div className={style.person}>
                <div className={style.personInformation}>
                    <div className={style.name}>{username}</div>
                    <div className={style.date}>{formatDate(createdAt)}</div>
                </div>
                <img src={userImage} alt="avatar" className={style.photo} onError={() => setUserImage(avatar)} />
                {fullText && (
                    <div className={style.buttonBlock}>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={confirmDelete}
                            okText="Yes"
                            cancelText="No"
                            placement={'rightTop'}
                        >
                            {currentUserIsAuthor && <button className={style.delete}>Delete</button>}
                        </Popconfirm>
                        <Link to={`${articles}${slug}/edit`} key={slug}>
                            {currentUserIsAuthor && <button className={style.edit}>Edit</button>}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
