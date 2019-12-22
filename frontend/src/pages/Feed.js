import React, { Component } from 'react';
import io from 'socket.io-client';
import api from '../services/api';

import './Feed.css';

import {Postlist} from './FeedStyles';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

import server from '../config/server';

class Feed extends Component {
    host = server.host;

    state = {
        feed: [],
    }

    async componentDidMount() {
        this.registerToSocket();

        const response = await api.get('posts');
        this.setState({ feed: response.data });
    }

    registerToSocket = () => {
        const socket = io(this.host);
        //post, like
        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] });
        });
        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id === likedPost._id ? likedPost : post
                )
            })
        });
    }

    handleLike = id => {
        api.post(`/posts/${id}/like`);
    }

    render() {
        return (
            <Postlist>
                {this.state.feed.map(post => (
                    <article key={post._id}>
                        <header>
                            <div className="user-info">
                                <span>{post.author}</span>
                                <span className="place">{post.place}</span>
                            </div>
                            <img src={more} alt="Mais" />
                        </header>
                        <img src={`${this.host}/files/${post.image}`} alt="" />
                        <footer>
                            <div className="actions">
                                <button type="button" onClick={() => this.handleLike(post._id)}>
                                    <img src={like} alt="" />
                                </button>
                                <img src={comment} alt="" />
                                <img src={send} alt="" />
                            </div>
                            <strong>{post.likes} curtidas</strong>
                            <p>
                                {post.description}
                                <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                ))}
            </Postlist>
        );
    }
}

export default Feed;