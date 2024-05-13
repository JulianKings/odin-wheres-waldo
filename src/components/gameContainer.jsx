/* eslint-disable react-hooks/exhaustive-deps */
import circle from '../assets/circle.svg';
import { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function GameContainer({ selectedStage, updateSelectedStage })
{
    const [stageChildren, setStageChildren] = useState(null);
    const gamePortrait = useRef(null);
    const selector = useRef(null);
    const gameFinished = useRef(null);
    const gameFinishedCaption = useRef(null);
    const gameFinishedForm = useRef(null);
    const [selectorStatus, setSelectorStatus] = useState(null);
    const [finishedCharacters, setFinishedCharacters] = useState([]);
    const gameTimer = useRef(null);
    const gameInput = useRef(null);
    const finishedTimer = useRef(null);

    useEffect(() => {
        fetch("http://localhost:3000/stage/children/" + selectedStage._id, {                
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
                setStageChildren(response.stageChildren);
                gameTimer.current = new Date();
            }
        })
        .catch((error) => {
            throw new Error(error);
        })
    }, []);

    let selectorContent = 'Loading characters...';

    if(stageChildren)
    {
        selectorContent = stageChildren.map((children) => {
            return <Fragment key={children._id}>
                <div className='game-selector-item' onClick={(event) => { onClickMenu(event, children.class_name); }}>
                    {children.name}
                </div>
            </Fragment>;
        })
    }

    return <>
        <div ref={gamePortrait} className='game-portrait' onClick={(event) => { onClickPortrait(event); }}>
            <img className='background' src={selectedStage.image_url} />
            <div ref={selector} className='game-selector'>
                {selectorContent}
            </div>
            <div ref={gameFinished} className='game-finished' onClick={(event) => { event.stopPropagation(); event.preventDefault(); }}>
                <div className='finished-box'>
                    <div className='finished-box-title'>Congratulations!</div>
                    <div ref={gameFinishedCaption} className='finished-box-caption'>You finished this puzzle in xx minutes and xx seconds!</div>
                    <div className='finished-box-save'>If you want to save your score, please input your name here: </div>
                    <div ref={gameFinishedForm} className='finished-box-form'>
                        <form method='post' onSubmit={submitWinner}>
                            <label htmlFor='user-name'>Name: </label>
                            <input ref={gameInput} type='text' id='user-name' name='username' placeholder='Your name' />
                            <button type='submit' onClick={(event) => { event.stopPropagation(); }}>Save</button>
                        </form>
                    </div>
                    <div className='finished-try-again'>
                    <button type='button' onClick={(event) => {
                        event.stopPropagation();
                        let clonedStage = { ...selectedStage };
                        if(!clonedStage.attempts)
                        {
                            clonedStage.attempts = 1;
                        } else {
                            clonedStage.attempts += 1;
                        }
                        updateSelectedStage(clonedStage);
                    }}>Try again!</button>
                    </div>
                </div>
            </div>
        </div>
    </>;

    function onClickPortrait(event)
    {
        let clientX = event.clientX;
        let clientY = event.clientY;
        let relativeClientX = 0;
        if(gamePortrait.current);
        {
            const parentRect = gamePortrait.current.getBoundingClientRect();
            clientX = clientX - parentRect.left;
            relativeClientX = (clientX) / (parentRect.width);
            relativeClientX = relativeClientX * 100;
            clientY = clientY - parentRect.top;

            if(selector.current)
            {
                if(selector.current.style.display === '' || selector.current.style.display === 'none' || selector.current.style.display === 'flex')
                {
                    selector.current.style.display = 'flex';
                    selector.current.style.left = clientX + 'px';
                    selector.current.style.top = clientY + 'px';
                    const statusObject = {
                        x: clientX,
                        y: clientY,
                        relativeX: relativeClientX
                    }
                    setSelectorStatus(statusObject);
                }
            }
        }
        //console.log('Pos: x: ' + clientX + " / y: " + clientY + " / relativeX: " + relativeClientX)
    }

    function onClickMenu(event, type)
    {
        event.stopPropagation();

        if(selector.current)
        {
            if(selector.current.style.display === 'flex')
            {
                selector.current.style.display = 'none';
                setSelectorStatus(0);
            }
        }

        let validSelection = false;

        if(!finishedCharacters.includes(type) && selectorStatus && stageChildren && stageChildren.length > 0)
        {
            const children = stageChildren.find((child) => {
                return (child.class_name === type);
            });

            if(children)
            {
                if(selectorStatus.relativeX > children.min_x && selectorStatus.relativeX < children.max_x)
                {
                    if(selectorStatus.y > children.min_y && selectorStatus.y < children.max_y)
                    {
                        validSelection = true;
                    }
                }
            }
        }

        if(validSelection && gamePortrait.current && selectorStatus)
        {
            const circleImage = document.createElement("img");
            circleImage.classList.add('circle');
            circleImage.src = circle;
            circleImage.style.left = (selectorStatus.x - 28) + 'px';
            circleImage.style.top = (selectorStatus.y - 28) + 'px';
            gamePortrait.current.appendChild(circleImage);

            let updateFinishedCharacters = [...finishedCharacters];
            updateFinishedCharacters.push(type);
            setFinishedCharacters(updateFinishedCharacters);

            // Check for game end
            if(updateFinishedCharacters.length === stageChildren.length)
            {
                // Game finished
                if(gameTimer.current && gameFinished.current && gameFinishedCaption.current)
                {
                    // Show results
                    const currentTimer = new Date();
                    const timeDiff = Math.ceil(Math.abs(currentTimer - gameTimer.current) / 1000);

                    gameFinished.current.style.display = 'flex';
                    let seconds = (timeDiff > 60) ? (timeDiff % 60) : timeDiff;
                    let minutes = (timeDiff > 60) ? (Math.trunc(timeDiff / 60)) : 0;
                    let finalMinutes = (minutes > 60) ? (minutes % 60) : minutes;
                    let hours = (minutes > 60) ? (Math.trunc(minutes / 60)) : 0;

                    let caption = 'You finished this puzzle in ';
                    if(hours > 0)
                    {
                        caption += hours + ' hours, ';
                    }
                    if(finalMinutes > 0)
                    {
                        caption += minutes + ' minutes, ';
                    }
                    if(seconds > 0)
                    {
                        caption += seconds + ' seconds!';
                    }

                    finishedTimer.current = {
                        hour: hours,
                        minute: finalMinutes,
                        second: seconds
                    }

                    gameFinishedCaption.current.textContent = caption;
                }
            }
        }
    }

    function submitWinner(event)
    {
        event.preventDefault();
        const winner = {};
        winner.name = gameInput.current.value;
        winner.time = finishedTimer.current;
        winner.stage = selectedStage._id;

        if(gameInput.current && gameInput.current.value && gameInput.current.value.length > 0 && finishedTimer.current)
        {
            fetch("http://localhost:3000/stage/add_winner", { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                dataType: 'json',
                body: JSON.stringify(winner),
            })
            .then((response) => {
            if (response.status >= 400) {
                throw new Error("server error");
            }
            return response.json();
            })
            .then((response) => {
                if(response.responseStatus)
                {
                    if(response.responseStatus === 'validWinner')
                    {
                        gameFinishedForm.current.textContent = 'Leaderboard entry saved successfully';
                    } else if(response.responseStatus === 'validUpdateWinner')
                    {
                        gameFinishedForm.current.textContent = 'Leaderboard entry updated successfully';
                    } else if(response.responseStatus === "invalidUpdateWinner")
                    {
                        gameFinishedForm.current.textContent = 'Your entry is already better!';
                    } else {
                        // TODO: notify error
                    }
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }

}

GameContainer.propTypes = {
    selectedStage: PropTypes.object,
    updateSelectedStage: PropTypes.func
}

export default GameContainer;