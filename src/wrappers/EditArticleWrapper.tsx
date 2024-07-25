import React from 'react';
import { useParams } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import SignInForm from '../components/SignInForm';
import { useAppSelector } from '../hooks/hooks';

const EditArticleWrapper = () => {
    const { slug } = useParams<{ slug: string }>();
    const posts = useAppSelector((state) => state.blogReducer.posts);
    const authorized = useAppSelector((state) => state.blogReducer.authorized);
    if (!authorized) {
        return <SignInForm />;
    }

    const post = posts.filter((e) => {
        return e.slug === slug;
    })[0];

    return <ArticleForm post={post} edit={true} />;
};
export default EditArticleWrapper;
