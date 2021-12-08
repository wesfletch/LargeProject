import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';

function SongTable()
{
    const [rows, setRows] = useState([]);
    useEffect(() => {
        async function getPlaylists() {
            var songs = JSON.parse(localStorage.getItem("rec"));
            const items = [];
            for (var i = 0; i < Math.min(songs.length, 7); i++)
            {
                var x = JSON.stringify(songs[i].name).replaceAll('"','');
                items.push(x);
            }
            setRows(items);
        }
        getPlaylists();
    }, []);
    if (rows.length == 0)
    {
        return null;
    }
    return (
        <div>
            <table>
                {rows.map((r) => (
                    <tr>
                        <td class="rowy">{r}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default SongTable;