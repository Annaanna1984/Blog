import React from 'react';
import ArticleForm from '../components/ArticleForm';
import SignInForm from '../components/SignInForm';
import { useAppSelector } from '../hooks/hooks';

const CreateArticleWrapper = () => {
    const authorized = useAppSelector((state) => state.blogReducer.authorized);
    if (!authorized) {
        return <SignInForm />;
    }

    return <ArticleForm edit={false} />;
};
export default CreateArticleWrapper;
