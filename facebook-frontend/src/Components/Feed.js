import React, { useEffect, useState } from 'react'
import './Feed.css'
import MessageSender from './MessageSender'
import Post from './Post'
import StoryReel from './StoryReel'
import axios from '../axios'
import Pusher from 'pusher-js'

import db from '../firebase'

const pusher = new Pusher('b4cb1be9bf227d28ad86', {
    cluster: 'us2'
  });

const Feed = () => {
    const [profilePic, setProfilePic] = useState('')
    const [postsData, setPostsData] = useState([])

    const syncFeed = () => {
        axios.get('/retrieve/posts')
            .then((res) => {
                setPostsData(res.data)
            })
    }

    useEffect(() => {
        const channel = pusher.subscribe('posts');
        channel.bind('inserted', function(data) {
        syncFeed()
    });
    }, [])

    useEffect(() => {
        syncFeed()
    }, [])

    return (
        <div className='feed' >
            <StoryReel />
            <MessageSender />

            {
                postsData.map(entry => (
                    <Post
                        profilePic={entry.avatar}
                        message={entry.text}
                        timestamp={entry.timestamp}
                        imgName={entry.imgName}
                        username={entry.user}
                    />
                ))
            }
        </div>
    )
}

export default Feed