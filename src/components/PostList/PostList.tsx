import React, { useEffect } from 'react';
import style from './PostList.module.scss';
import Post from '../Post';
import { Article, changePage, fetchPosts, getToken } from '../../store/reducer/blogSlice';
import { Spin, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

export const PostList = () => {
    const posts = useAppSelector<Article[]>((state) => state.blogReducer.posts);
    console.log(posts);
    const { status, totalCount, currentPage } = useAppSelector((state) => state.blogReducer);
    const dispatch = useAppDispatch();
    const token = getToken();

    useEffect(() => {
        dispatch(fetchPosts({ offset: 20 * (currentPage - 1), token: token }));
    }, [currentPage, dispatch, token]);

    if (status === 'rejected') {
        return <div>Ошибка при получении данных на сервере</div>;
    }

    return (
        <>
            <ul className={style.postList}>
                {status === 'loading' && <Spin className={style.spin} size="large" />}
                {posts?.map((post: Article) => {
                    console.log(post);
                    return (
                        <li className={style.postLink} key={post.slug}>
                            <Link to={`/posts/${post.slug}`} key={post.slug}>
                                <Post post={post} fullText={false} />
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <Pagination
                onChange={(e) => {
                    dispatch(fetchPosts({ offset: 20 * (e - 1), token: token }));
                    dispatch(changePage(e));
                }}
                total={Math.ceil(totalCount / 20)}
                current={currentPage}
                defaultCurrent={1}
                defaultPageSize={1}
                className={style.pagination}
            />
        </>
    );
};
