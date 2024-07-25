import React from 'react';
import SignInForm from '../components/SignInForm';
import ProfileForm from '../components/EditProfileForm';
import { useAppSelector } from '../hooks/hooks';

const EditProfileWrapper = () => {
    const authorized = useAppSelector((state) => state.blogReducer.authorized);
    if (!authorized) {
        return <SignInForm />;
    }

    return <ProfileForm />;
};
export default EditProfileWrapper;
