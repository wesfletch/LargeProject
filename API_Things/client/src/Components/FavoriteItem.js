import React from 'react';

const txt="";
function func(value, _index, _array) {
    txt += value + "<br>"; 
}

const FavoriteItem = props =>{
    return (
            <dl>
                <dt><b>{"Genres:"}</b></dt>
                <dd>{props.favorite.genres.getEach(func)}</dd>
                <dt><b>{"Artists:"}</b></dt>
                <dd>{props.favorite.artists.getEach(func)}</dd>
                <dt><b>{"Tracks:"}</b></dt>
                <dd>{props.favorite.tracks.getEach(func)}</dd>
            </dl>
    )
}

export default FavoriteItem;
