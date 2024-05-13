/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function LeaderboardItem({ leaderboardEntry, alternate })
{
    let formatHour = (leaderboardEntry.hour < 10) ? ('0' + leaderboardEntry.hour) : leaderboardEntry.hour;
    let formatMinute = (leaderboardEntry.minute < 10) ? ('0' + leaderboardEntry.minute) : leaderboardEntry.minute;
    let formatSecond = (leaderboardEntry.second < 10) ? ('0' + leaderboardEntry.second) : leaderboardEntry.second;

    return <div className={ (alternate) ? 'leaderboard-item' : 'leaderboard-item alternate'}>
        <div className='leaderboard-item-name'> {leaderboardEntry.name} </div>
        <div className='leaderboard-item-time'>{formatHour}:{formatMinute}:{formatSecond}</div>
    </div>;

}

LeaderboardItem.propTypes = {
    leaderboardEntry: PropTypes.object,
    alternate: PropTypes.bool
}

function LeaderboardContainer({ selectedStage })
{
    const [stageLeaderboard, setStageLeaderboard] = useState(null);
    useEffect(() => {
        fetch("http://localhost:3000/stage/leaderboard/" + selectedStage._id, {                
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            dataType: 'json',
         })
        .then((response) => {
          if (response.status >= 400) {
            throw new Error("server error");
          }
          return response.json();
        })
        .then((response) => {
            if(response && response.responseStatus === 'validRequest')
            {
                setStageLeaderboard(response.stageLeaderboard);
            }
        })
        .catch((error) => {
            throw new Error(error);
        })
    }, []);

    let leaderboardContent = 'Loading Leaderboard...'; 

    if(stageLeaderboard)
    {
        // do something
        if(stageLeaderboard.length > 0)
        {
            let alternate = true;

            const leaderboardObjects = stageLeaderboard.map((leaderboardEntry) => {
                alternate = !alternate;
                return <LeaderboardItem key={leaderboardEntry._id} leaderboardEntry={leaderboardEntry} alternate={alternate} />
            })

            leaderboardContent = <div className='leaderboard'>
                <div className='leaderboard-item'>
                    <div className='leaderboard-item-name title'>Name</div>
                    <div className='leaderboard-item-time title time-title'>Time</div>
                </div>
                {leaderboardObjects}
            </div>;
        } else {
            leaderboardContent = 'There are no entries for this stage right now.'
        }
        
    }

    return <>
        <div className='game-leaderboard'>
            {leaderboardContent}
        </div>
    </>
}

LeaderboardContainer.propTypes = {
    selectedStage: PropTypes.object
}

export default LeaderboardContainer;