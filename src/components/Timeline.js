import React from 'react';
import TootDetail from './TootDetail';

const Timeline = (props) => {
    const toot_list = props.toot_list.map((toot) => {
        const parsedToot = JSON.parse(toot.payload);
        return <TootDetail key={parsedToot.id} toot={parsedToot} onTootClick={props.onTootClick}/>
    });

    return <div className="timeline ui relaxed selection divided list">{toot_list}</div>
};

export default Timeline;