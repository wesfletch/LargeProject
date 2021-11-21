import React from 'react';

const txt="";
function func(value, _index, _array) {
    txt += value + "<br>"; 
}

const FriendItem = props =>{
    return (
        <div>
        <h2><b>{props.friend.name}</b></h2>
        <h2><b>Favorites</b></h2>
        <dl>
            <dt><b>{"Genres:"}</b></dt>
            <dd>{props.favorite.genres.getEach(func)}</dd>
            <dt><b>{"Artists:"}</b></dt>
            <dd>{props.favorite.artists.getEach(func)}</dd>
            <dt><b>{"Tracks:"}</b></dt>
            <dd>{props.favorite.tracks.getEach(func)}</dd>
        </dl>
        </div>
    )
}

export default FriendItem;

