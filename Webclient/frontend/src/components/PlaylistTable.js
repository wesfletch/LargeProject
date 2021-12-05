import React, {useEffect, useState} from 'react';
import reportWebVitals from '../reportWebVitals';

function PlaylistTable()
{
    const [playlists, setPlaylists] = useState(null);
    function getOtherPath()
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://poosd-f2021-11.herokuapp.com/users/playlists';
        }
        else
        {
            return 'http://localhost:5000/users/playlists';
        }
    }
    useEffect(() => {
        async function getPlaylists() {
            let response = await fetch(getOtherPath(), {method:'GET',credentials:'include',headers:{'Content-Type':'application/json'}});
            response = await response.json();
            setPlaylists(response);
            //alert(JSON.stringify(playlists.playlists[0].name));
        }
        getPlaylists();
        //return () => {createTable();}
        //alert(JSON.stringify(playlists.playlists[0].name));
    }, []);
    if (playlists != null)
    {
        const rows = [];
        for (var i = 0; i < playlists.playlists.length; i++)
        {
            //rows.push(playlists.playlists[i].name):
            rows.push(JSON.stringify(playlists.playlists[i].name).replaceAll('"',''));
        }
        return (
            <div>
                <table>
                    {rows.map((r) => (
                        <tr>
                            <td>{r}</td>
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

export default PlaylistTable;