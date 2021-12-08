import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';

function SongTable()
{
    const [playlists, setPlaylists] = useState(null);
    const [rows, setRows] = useState([]);
    const [deleted, setDeleted] = useState(null);
    function getPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/playlist/';
        }
        else
        {
            return 'http://localhost:5000/users/playlist/';
        }
    }
    async function doDeletePlaylist(name) {
        alert('under development');
        return;
        //event.preventDefault();
        var id = sessionStorage.getItem(name);
        try
        {
            const response = await fetch(getPath() + id, {method:'DELETE',credentials:'include',headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (!res.message.msgError)
            {
                let items = rows.filter(row => row != name);
                setDeleted(deleted + 1);
                setRows(items);
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }
    function getOtherPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/playlist/';
        }
        else
        {
            return 'http://localhost:5000/users/playlist/';
        }
    }
    useEffect(() => {
        async function getPlaylists() {
            let response = await fetch(getOtherPath() + localStorage.getItem("playlist"), {method:'GET',credentials:'include',headers:{'Content-Type':'application/json'}});
            response = await response.json();
            //alert(response.playlist.tracks[0].name);
            setPlaylists(response.playlist.tracks);
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
                var x = JSON.stringify(playlists[i].name).replaceAll('"','');
                items.push(x);
            }
            setRows(items);
        }
        if (rows.length != (playlists.length - deleted))
        {
            return null;
        }
        return (
            <div>
                <table>
                    {rows.map((r) => (
                        <tr>
                            <td>{r}</td>
                            <Button variant='signInBtn' size="big" onClick={async () => {await doDeletePlaylist(r);}}>
                            Delete
                            </Button>
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

export default SongTable;