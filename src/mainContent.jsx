import { useEffect, useState } from 'react';
import GameContainer from './components/gameContainer';
import './content.css';
import StageItem from './components/items/stageItem';

function MainContent () {
    const [stageList, setStageList] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/stage/all", {                
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
                setStageList(response.stages);
            }
        })
        .catch((error) => {
            throw new Error(error);
        })
    }, []);

    let gameContent = 
        <div className='game-hold-portrait'>
            Please, select a stage
        </div>;

    if(selectedStage)
    {
        gameContent = <GameContainer key={selectedStage.attempts} selectedStage={selectedStage} updateSelectedStage={setSelectedStage} />;
    }

    let stageContent = 'Loading stages...';
    if(stageList)
    {
        stageContent = stageList.map((stage) => <StageItem key={stage._id} stage={stage} updateSelectedStage={setSelectedStage} />)
    }

    return <>
    <header className='header-container'>
        <div className='header-content'>Where&apos;s Waldo?</div>
    </header>
    <main className='main-container'>
        {gameContent}
        <div className='stage-selector'>
            <div className='stage-selector-caption'>Available stages</div>
            {stageContent}
        </div>
    </main>
    <footer className='footer-container'>
        <div className='footer-content'>Site developed as part of The Odin Project</div>
    </footer>
    </>;
}

export default MainContent