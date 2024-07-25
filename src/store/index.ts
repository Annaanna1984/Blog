import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '../store/reducer/blogSlice';

const store = configureStore({
    reducer: {
        blogReducer: blogReducer
    }
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
