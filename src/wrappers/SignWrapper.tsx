import React from 'react';
import SignInForm from '../components/SignInForm';
import PostList from '../components/PostList';
import SignUp from '../components/SignUpForm';
import { useAppSelector } from '../hooks/hooks';

interface SignWrapperProps {
    signIn: boolean;
}
const SignWrapper: React.FC<SignWrapperProps> = ({ ...props }) => {
    const authorized = useAppSelector((state) => state.blogReducer.authorized);
    if (authorized) {
        return <PostList />;
    }

    const signIn = props.signIn;

    return signIn ? <SignInForm /> : <SignUp />;
};
export default SignWrapper;
