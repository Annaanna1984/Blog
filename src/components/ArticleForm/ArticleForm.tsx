import React, { ChangeEvent, useEffect, useState } from 'react';
import style from './ArticleForm.module.scss';
import { Link, useHistory } from 'react-router-dom';
import { Article, createArticle, editArticle, getToken } from '../../store/reducer/blogSlice';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/hooks';
import { Simulate } from 'react-dom/test-utils';
import reset = Simulate.reset;
import { Spin } from 'antd';

type ArticleFormProps = {
    edit: boolean;
    post?: Article;
};

type ArticleInputForm = {
    title: string;
    description: string;
    text: string;
    tags: Tag[];
};

type Tag = {
    tag: string;
};

const REQUIRED_FIELD_MESSAGE = "Can't be empty";

const ArticleForm: React.FC<ArticleFormProps> = ({ ...props }) => {
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();
    const history = useHistory();

    const token = getToken();

    const onSubmit = (data: ArticleInputForm) => {
        console.log(data);
        props.edit
            ? dispatch(
                  editArticle({
                      token: token,
                      slug: props.post?.slug,
                      articleData: {
                          title: data.title,
                          description: data.description,
                          body: data.text,
                          tagList: data.tags.map((e: Tag) => e.tag)
                      }
                  })
              )
            : dispatch(
                  createArticle({
                      token: token,
                      articleData: {
                          title: data.title,
                          description: data.description,
                          body: data.text,
                          tagList: data.tags.map((e: Tag) => e.tag)
                      }
                  })
              );
        reset();
        history.push(props.edit ? `/posts/${props.post?.slug}` : '/');
    };

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        control,
        reset
    } = useForm<ArticleInputForm>({
        mode: 'onBlur'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags'
    });

    useEffect(() => {
        reset({
            description: props.edit ? props.post?.description : '',
            title: props.edit ? props.post?.title : '',
            text: props.edit ? props.post?.body : '',
            tags: props.edit
                ? props.post?.tagList.map((e: string) => {
                      return { tag: e };
                  })
                : []
        });
        setLoading(false);
    }, [props.edit, props.post, reset]);

    if (loading) {
        return <Spin className={style.spin} />;
    }

    return (
        <div className={style.form}>
            <h2 className={style.formTitle}>{props.edit ? 'Edit article' : 'Create new article'}</h2>
            <form className={style.forma} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title">
                    Title
                    <input
                        {...register('title', {
                            required: REQUIRED_FIELD_MESSAGE,
                            maxLength: {
                                value: 1000,
                                message: 'title length must be < 1000 characters'
                            }
                        })}
                        id="title"
                        type="text"
                        placeholder="Title"
                        className={style.title}
                    />
                </label>
                <div className={style.error}>
                    {errors?.title && <p>{errors?.title?.message?.toString() || 'error'}</p>}
                </div>

                <label htmlFor="description">
                    Short description
                    <input
                        {...register('description', {
                            required: REQUIRED_FIELD_MESSAGE
                        })}
                        id="description"
                        type="text"
                        placeholder="Short description"
                        className={style.description}
                    />
                </label>
                <div className={style.error}>
                    {errors?.description && <p>{errors?.description?.message?.toString() || 'error'}</p>}
                </div>

                <label htmlFor="text">
                    Text
                    <input
                        {...register('text', {
                            required: REQUIRED_FIELD_MESSAGE
                        })}
                        id="text"
                        type="text"
                        placeholder="Text"
                        className={style.text}
                    />
                </label>
                <div className={style.error}>
                    {errors?.text && <p>{errors?.text?.message?.toString() || 'error'}</p>}
                </div>
                <label htmlFor="tags">
                    Tags <br />
                    {fields.map((e, i) => {
                        const actualIdx = `tags.${i}.tag` as 'tags.0.tag';
                        return (
                            <>
                                <div className="input_container" key={e.id}>
                                    <input
                                        {...register(actualIdx, {
                                            required: 'field is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9]+$/,
                                                message:
                                                    'You can use only english letters and digits without spaces and other symbols'
                                            }
                                        })}
                                        id={i.toString()}
                                        type={'text'}
                                        placeholder={'tag'}
                                        className={style.tag}
                                    />
                                    <button className={style.delete} onClick={() => remove(i)}>
                                        Delete
                                    </button>
                                    {i === fields.length - 1 && (
                                        <button className={style.addTag} onClick={() => append({ tag: '' })}>
                                            Add tag
                                        </button>
                                    )}
                                    <div className={style.error}>
                                        {errors?.tags && <p>{errors.tags[i]?.message?.toString()}</p>}
                                    </div>
                                </div>
                            </>
                        );
                    })}
                </label>
                {fields.length === 0 && (
                    <button
                        className={style.addFirstTag}
                        onClick={(e) => {
                            e.preventDefault();
                            append({ tag: '' });
                        }}
                    >
                        Add tag
                    </button>
                )}

                <input
                    type="submit"
                    disabled={!isValid}
                    value="Send"
                    className={isValid ? style.validButton : style.invalidButton}
                />
            </form>
        </div>
    );
};
export default ArticleForm;
