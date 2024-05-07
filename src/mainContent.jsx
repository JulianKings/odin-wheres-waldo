import './content.css';
import waldoImage from './assets/waldo.webp';
import circle from './assets/circle.svg';
import { useRef, useState } from 'react';

function MainContent () {
    const gamePortrait = useRef(null);
    const selector = useRef(null);
    const [selectorStatus, setSelectorStatus] = useState(null);
    const [finishedCharacters, setFinishedCharacters] = useState([]);

    return <>
    <header className='header-container'>
        <div className='header-content'>Where&apos;s Waldo?</div>
    </header>
    <main className='main-container'>
        <div ref={gamePortrait} className='game-portrait' onClick={(event) => { onClickPortrait(event); }}>
            <img className='background' src={waldoImage} />
            <div ref={selector} className='game-selector'>
                <div className='game-selector-item' onClick={(event) => { onClickMenu(event, 'waldo'); }}>Waldo</div>
                <div className='game-selector-item' onClick={(event) => { onClickMenu(event, 'oldaw'); }}>Oldaw</div>
                <div className='game-selector-item' onClick={(event) => { onClickMenu(event, 'waldowatcher'); }}>Waldo&apos;s Watcher</div>
            </div>
        </div>

    </main>
    <footer className='footer-container'>
        <div className='footer-content'>Site developed as part of The Odin Project</div>
    </footer>
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
        console.log('Pos: x: ' + clientX + " / y: " + clientY + " / relativeX: " + relativeClientX)
    }

    function onClickMenu(event, type)
    {
        event.stopPropagation();
        console.log(type);

        if(selector.current)
        {
            if(selector.current.style.display === 'flex')
            {
                selector.current.style.display = 'none';
                setSelectorStatus(0);
            }
        }

        let validSelection = false;

        if(type === 'waldo' && selectorStatus && !finishedCharacters.includes(type))
        {
            if(selectorStatus.relativeX > 50 && selectorStatus.relativeX < 55)
            {
                if(selectorStatus.y > 295 && selectorStatus.y < 345)
                {
                    validSelection = true;
                }
            }
        }

        if(type === 'oldaw' && selectorStatus && !finishedCharacters.includes(type))
        {
            if(selectorStatus.relativeX > 22 && selectorStatus.relativeX < 26)
            {
                if(selectorStatus.y > 301 && selectorStatus.y < 358)
                {
                    validSelection = true;
                }
            }
        }

        if(type === 'waldowatcher' && selectorStatus && !finishedCharacters.includes(type))
        {
            if(selectorStatus.relativeX > 64 && selectorStatus.relativeX < 66)
            {
                if(selectorStatus.y > 508 && selectorStatus.y < 538)
                {
                    validSelection = true;
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
        }
    }
}

export default MainContent