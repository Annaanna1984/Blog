import React from 'react';
import style from './App.module.scss';
import Header from '../Header';
import PostList from '../PostList';
import PostWrapper from '../../wrappers/PostWrapper';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EditArticleWrapper from '../../wrappers/EditArticleWrapper';
import CreateArticleWrapper from '../../wrappers/CreateArticleWrapper';
import EditProfileWrapper from '../../wrappers/EditProfileWrapper';
import SignWrapper from '../../wrappers/SignWrapper';

function App() {
    return (
        <Router>
            <div className={style.app}>
                <Header />
                <main className={style.main}>
                    <Switch>
                        <Route exact path={['/', '/articles/']} component={PostList} />
                        <Route exact path="/posts/:slug" component={PostWrapper} />
                        <Route exact path="/sign-in" component={() => <SignWrapper signIn={true} />} />
                        <Route exact path="/sign-up" component={() => <SignWrapper signIn={false} />} />
                        <Route exact path="/profile" component={EditProfileWrapper} />
                        <Route exact path="/new-article" component={CreateArticleWrapper} />
                        <Route exact path="/articles/:slug/edit" component={EditArticleWrapper} />
                        <Route path="*">
                            <h1>404 – Page not found</h1>
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;
