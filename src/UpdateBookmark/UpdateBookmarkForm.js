import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './UpdateBookmarkForm.css'

const Required = () => (
    <span className='UpdateBookmark__required'>*</span>
)

export default class UpdateBookmarkForm extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object,
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    }

    static contextType = BookmarksContext;

    state = {
        error: null,
        id: '',
        title: '',
        url: '',
        description: '',
        rating: 1,
    }

    componentDidMount() {
        const { bookmarkId } = this.props.match.params
        fetch(config.API_ENDPOINT + `${bookmarkId}`, {
            method: 'GET',
            headers: {
                'authorization': `bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(error => Promise.reject(error))

                return res.json()
            })
            .then(responseData => {
                this.setState({
                    id: responseData.id,
                    title: responseData.title,
                    url: responseData.url,
                    description: responseData.description,
                    rating: responseData.rating,
                })
            })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value })
    }

    handleChangeUrl = e => {
        this.setState({ url: e.target.value })
    }

    handleChangeDescription = e => {
        this.setState({ description: e.target.description })
    }

    handleChangeRating = e => {
        this.setState({ rating: e.target.rating })
    }

    handleSubmit = e => {
        e.preventDefault()
        //validation
        const { bookmarkId } = this.props.match.params
        const { id, title, url, description, rating } = this.state
        const updatedBookmark = { id, title, url, description, rating }

        fetch(config.API_ENDPOINT + `${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedBookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            },
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(error => Promise.reject(error))
            })
            .then(() => {
                this.resetFields(updatedBookmark)
                this.context.updateBookmark(updatedBookmark)
                this.props.history.push('/')
            })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })
    }

    resetFields = (newFields) => {
        this.setState({
            id: newFields.id || '',
            title: newFields.title || '',
            url: newFields.url || '',
            description: newFields || '',
            rating: newFields.rating || '',
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    };

    render() {
        const { title, url, description, rating, error } = this.state
        return (
            <section className='UpdateBookmarkForm'>
                <h2>Update Bookmark</h2>
                <form className='UpdateBookmark__form' onSubmit={this.handleSubmit}>
                    <div className='UpdateBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
              {' '}
                            <Required />
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            placeholder='Great website!'
                            required
                            value={title}
                            onChange={this.handleChangeTitle}
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
              {' '}
                            <Required />
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            placeholder='https://www.great-website.com/'
                            required
                            value={url}
                            onChange={this.handleChangeUrl}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
            </label>
                        <textarea
                            name='description'
                            id='description'
                            value={description}
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
              {' '}
                            <Required />
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            defaultValue='1'
                            min='1'
                            max='5'
                            required
                            value={rating}
                            onChange={this.handleChangeRating}
                        />
                    </div>
                    <div className='UpdateBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
            </button>
                        {' '}
                        <button type='submit'>
                            Update
            </button>
                    </div>
                </form>
            </section>
        )
    }
}