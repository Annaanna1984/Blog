import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';
import { Article, fetchArticle, getToken } from '../store/reducer/blogSlice';
import style from '../components/PostList/PostList.module.scss';
import { Spin, Alert } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

const PostWrapper = () => {
    const { slug } = useParams<{ slug: string }>();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({} as Article);
    const token = getToken();
    const posts = useAppSelector((state) => state.blogReducer.posts);
    const dispatch = useAppDispatch();

    const getPost = useCallback(() => {
        const selectorPost = posts.find((e) => e.slug === slug);
        if (selectorPost) {
            setPost(selectorPost);
            setLoading(false);
        } else {
            dispatch(fetchArticle({ slug, token }))
                .then((d) => {
                    if (d.meta.requestStatus === 'fulfilled') {
                        setPost(d.payload as Article);
                    }
                })
                .then(() => setLoading(false));
        }
    }, [dispatch, posts, slug, token]);

    useEffect(() => {
        getPost();
    }, [getPost]);

    return loading ? (
        <Spin className={style.spin} size="large" />
    ) : post.author ? (
        <Post post={post} fullText={true} />
    ) : (
        <Alert message="Post not found" description={`Post ${slug} not found`} showIcon={true} type="error" />
    );
};

export default PostWrapper;
