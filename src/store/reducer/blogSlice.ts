import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const baseURL = 'https://blog.kata.academy/api/';

export const getToken = (newToken: string | undefined = undefined, logOut = false) => {
    if (newToken) localStorage.setItem('token', newToken);
    if (logOut) localStorage.removeItem('token');
    const token = localStorage.getItem('token');
    return token ? token : undefined;
};

type GetAllPayload = {
    offset: number;
    token?: string;
};

export type Article = {
    author: {
        following: boolean;
        image: string;
        username: string;
    };
    body: string;
    createdAt: string;
    description: string;
    favorited: boolean;
    favoritesCount: number;
    slug: string;
    tagList: string[];
    title: string;
    updatedAt: string;
};

type FetchPost = {
    articles: Article[];
    articlesCount: number;
};

type UnexpectedError = {
    body: string;
};

export const fetchPosts = createAsyncThunk<FetchPost, GetAllPayload, { rejectValue: UnexpectedError }>(
    'posts/fetchPosts',
    async function ({ offset, token }, { rejectWithValue }) {
        const response = await fetch(`${baseURL}articles?offset=${offset}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data;
    }
);

type FetchArticlePayload = {
    slug: string;
    token?: string;
};
export const fetchArticle = createAsyncThunk<Article, FetchArticlePayload, { rejectValue: UnexpectedError }>(
    'posts/fetchArticle',
    async function ({ slug, token }: FetchArticlePayload, { rejectWithValue }) {
        const response = await fetch(`${baseURL}articles/${slug}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.article;
    }
);

type LoginPayload = {
    email: string;
    password: string;
};

type User = {
    email: string;
    token: string;
    username: string;
    bio?: string;
    image?: string;
};

export const fetchUser = createAsyncThunk<User, LoginPayload, { rejectValue: UnexpectedError }>(
    'users/fetchUser',
    async function (payload, { rejectWithValue }) {
        console.log(`#### postSlice.ts inside`);
        const response = await fetch(`${baseURL}users/login`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ user: payload })
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        getToken(data.user.token);
        return data.user;
    }
);

export const logOut = createAsyncThunk<undefined | string>('blog/logOut', async () => {
    return getToken(undefined, true);
});

type RegisterPayload = {
    email: string;
    password: string;
    username: string;
};

type RegisterErrors = {
    email: string;
    username: string;
};

export const fetchRegister = createAsyncThunk<User, RegisterPayload, { rejectValue: RegisterErrors }>(
    'users/fetchRegister',
    async function (payload: RegisterPayload, { rejectWithValue }) {
        const response = await fetch(`${baseURL}users`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ user: payload })
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data;
    }
);

export const getCurrentUser = createAsyncThunk<User, string, { rejectValue: UnexpectedError }>(
    'user/getCurrentUser',
    async function (token, { rejectWithValue }) {
        const response = await fetch(`${baseURL}user`, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.user;
    }
);

type CurrentUserPayload = {
    token?: string;
    userData: {
        email: string;
        username: string;
        bio?: string;
        password: string;
        image: string;
    };
};

export const updateCurrentUser = createAsyncThunk<User, CurrentUserPayload, { rejectValue: UnexpectedError }>(
    'user/updateCurrentUser',
    async function (payload, { rejectWithValue }) {
        const response = await fetch(`${baseURL}user`, {
            method: 'PUT',
            headers: {
                Authorization: `Token ${payload.token}`,
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ user: payload.userData })
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.user;
    }
);

export const createArticle = createAsyncThunk<Article, ArticlePayload, { rejectValue: UnexpectedError }>(
    'article/createArticle',
    async function (payload, { rejectWithValue }) {
        console.log('payload ' + payload.articleData);
        const response = await fetch(`${baseURL}articles`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${payload.token}`,
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ article: payload.articleData })
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.article;
    }
);

export const editArticle = createAsyncThunk<Article, ArticlePayload, { rejectValue: UnexpectedError }>(
    'article/editArticle',
    async function (payload, { rejectWithValue }) {
        console.log('payload ' + payload.articleData);
        const response = await fetch(`${baseURL}articles/${payload.slug}`, {
            method: 'PUT',
            headers: {
                Authorization: `Token ${payload.token}`,
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ article: payload.articleData })
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.article;
    }
);
type ArticlePayload = {
    token?: string;
    slug?: string;
    articleData?: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
    };
};
export const deleteArticle = createAsyncThunk<Article, ArticlePayload, { rejectValue: UnexpectedError }>(
    'article/deleteArticle',
    async function (payload, { rejectWithValue }) {
        const response = await fetch(`${baseURL}articles/${payload.slug}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${payload.token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.article;
    }
);

type LikePayload = {
    token?: string;
    slug: string;
};

export const addLike = createAsyncThunk<Article, LikePayload, { rejectValue: UnexpectedError }>(
    'article/addLike',
    async function (payload, { rejectWithValue }) {
        console.log(payload);
        const response = await fetch(`${baseURL}articles/${payload.slug}/favorite`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${payload.token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.article;
    }
);

export const deleteLike = createAsyncThunk<Article, LikePayload, { rejectValue: string }>(
    'article/deleteLike',
    async function (payload, { rejectWithValue }) {
        const response = await fetch(`${baseURL}articles/${payload.slug}/favorite`, {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${payload.token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.errors);
        }
        return data.article;
    }
);

function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
}

type BlogState = {
    posts: Article[];
    currentPage: number;
    totalCount: number;
    status?: string;
    error?: string;
    email?: string;
    token?: string;
    id?: string;
    user: User;
    authorized: boolean;
};

const initialState: BlogState = {
    posts: [],
    currentPage: 1,
    totalCount: 0,
    user: {} as User,
    authorized: false
};

const blogSlice = createSlice({
    name: 'postList',
    initialState,
    reducers: {
        changePage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state) => {
            state.status = 'loading';
            state.error = undefined;
        });
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'resolved';
            console.log(action.payload);
            state.posts = action.payload.articles;
            state.totalCount = action.payload.articlesCount;
        });
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload?.body;
        });
        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.user = action.payload;
            state.authorized = Boolean(action.payload.username);
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return { ...state, user: action.payload, authorized: Boolean(action.payload?.username) };
        });
        builder.addCase(fetchArticle.fulfilled, (state, action) => {
            return { ...state, posts: [action.payload] };
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            return { ...state, user: action.payload, authorized: Boolean(action.payload?.username) };
        });
        builder.addCase(logOut.fulfilled, (state) => {
            return { ...state, authorized: false, user: {} as User };
        });
        builder.addCase(updateCurrentUser.fulfilled, (state, action) => {
            return { ...state, user: action.payload, authorized: Boolean(action.payload?.username) };
        });
        builder.addCase(createArticle.fulfilled, (state, action) => {
            state.posts.unshift(action.payload);
        });
        builder.addCase(editArticle.fulfilled, (state, action) => {
            const idx = state.posts.findIndex((e) => e.slug === action.payload.slug);
            state.posts[idx] = action.payload;
        });
        builder.addCase(deleteArticle.fulfilled, (state, action) => {
            console.log(action);
            const idx = state.posts.findIndex((e) => e.slug === action.payload.slug);
            state.posts = state.posts.slice(0, idx).concat(state.posts.slice(idx, state.posts.length));
        });
        builder.addCase(addLike.fulfilled, (state, action) => {
            console.log(action);
            const idx = state.posts.findIndex((e) => e.slug === action.payload.slug);
            state.posts[idx] = action.payload;
        });
        builder.addCase(deleteLike.fulfilled, (state, action) => {
            console.log(action);
            const idx = state.posts.findIndex((e) => e.slug === action.payload.slug);
            state.posts[idx] = action.payload;
        });
        builder.addMatcher(isError, (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        });
    }
});

export const { changePage } = blogSlice.actions;
export default blogSlice.reducer;
