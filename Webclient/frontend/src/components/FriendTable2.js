import React, {useEffect, useState} from 'react';
import {Button, Form, Check} from 'react-bootstrap';

function FriendTable2()
{
    const [playlists, setPlaylists] = useState(null);
    const [rows, setRows] = useState([]);
    const [deleted, setDeleted] = useState(null);
    function getOtherPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/friends/';
        }
        else
        {
            return 'http://localhost:5000/users/friends/';
        }
    }
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/fetch/recspipe';
        }
        else
        {
            return 'http://localhost:5000/fetch/recspipe';
        }
    }
    async function setFriend(name)
    {
        // grab their favs
        var i = 0;
        while (i < playlists.length && JSON.stringify(playlists[i].display_name).replaceAll('"','') != name)
        {
            i++;
        }
        if (i < playlists.length)
        {
            var obj = {artists:[JSON.stringify(playlists[i].fav_artists[0]).replaceAll('"','')], tracks:[JSON.stringify(playlists[i].fav_tracks[0]).replaceAll('"','')], genres:[JSON.stringify(playlists[i].fav_genres[0]).replaceAll('"','')]};
            var js = JSON.stringify(obj);
            try
            {
                const response = await fetch(getPath(), {method:'POST',credentials: 'include', body:js,headers:{'Content-Type':'application/json'}});
                var res = await response.text();
                //alert(js + res);
                //alert('testa');
                localStorage.setItem("rec", res);
                //alert('test');
                //window.location.href = '/recList';
            }
            catch(e)
            {
                alert(js + e.toString());
                return;
            }
        }
    }
    useEffect(() => {
        async function getPlaylists() {
            let response = await fetch(getOtherPath(), {method:'GET',credentials:'include',headers:{'Content-Type':'application/json'}});
            response = JSON.parse(await response.text());
            //alert(response);
            //alert(JSON.parse(response.text()));
            //alert(response.playlist.tracks[0].name);
            setPlaylists(response.friends);
        }
        getPlaylists();
    }, []);
    if (playlists != null)
    {
        if (rows.length == 0 && deleted == null)
        {
            setDeleted(0);
            const items = [];
            for (var i = 0; i < playlists.length; i++)
            {
                var x = JSON.stringify(playlists[i].display_name).replaceAll('"','');
                items.push(x);
                //alert(x);
            }
            setRows(items);
        }
        if (rows.length != (playlists.length))
        {
            return null;
        }
        return (
            <div>
                <table>
                    {rows.map((r) => (
                        <tr>
                            <td class="rowy">{r}</td>
                            <Form.Check type="radio" onClick={async () => {await setFriend(r);}}/>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }
    else
    {
        return null;
    }
};

export default FriendTable2;