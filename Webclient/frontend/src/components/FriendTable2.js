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
    function setFriend(name)
    {
        // grab their favs
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
                            <Form.Check type="radio" onChange={setFriend({r})}/>
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