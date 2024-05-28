/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../content.css';
import deleteIcon from '../assets/delete.svg';
import { useNavigate } from 'react-router-dom';

function CharacterSheet({ character, selected, setSelected, updateCharacters, currentList, updateSelector })
{
    let characterNameContent = character.name;
    let selectedContent = '';
    if(character.id === selected)
    {
        characterNameContent = <Fragment>
            <label htmlFor={'character-name-' + character.id}>Character name</label>
            <input type='text' id={'character-name-' + character.id} name={'character-name-' + character.id} defaultValue={character.name} onChange={(event) => {
                // update name
                const listCopy = currentList.filter((char) => {
                    return (character.id !== char.id);
                });

                const characterCopy = {
                    id: character.id,
                    name: event.target.value,
                    position: character.position
                }

                listCopy.push(characterCopy);

                listCopy.sort((a, b) => a.id - b.id);

                updateCharacters(listCopy);
            }} />
        </Fragment>;

        selectedContent = <Fragment>
            <div className='character-selected-caption'>
                Selected
            </div>

            <div className='character-selected-delete' onClick={() => {
                // delete
                const listCopy = currentList.filter((char) => {
                    return (character.id !== char.id);
                });

                updateCharacters(listCopy);
                setSelected(-1);
            }}>
                <img src={deleteIcon} />
            </div>
        </Fragment>
    }

    let positionContent = <span>{'Position: Empty'}</span>;
    if(character.position !== null)
    {
        positionContent = <span>{'Position: '}<strong>{'SET'}</strong></span>;
    }

    return <>
        <div className={(character.id === selected) ? 'stage-character-item selected' : 'stage-character-item'} onClick={() => {
            if(selected !== character.id)
            {
                const charPosition = currentList.find((char) => char.id === character.id).position;
                if(charPosition !== null)
                {
                    updateSelector(charPosition);
                }
                setSelected(character.id);
            }
        }}>
            <div className='stage-character-name'>
                {selectedContent}
                {characterNameContent}
                <div className='position-caption'>
                    {positionContent}
                </div>
            </div>
        </div>
    </>;
}

CharacterSheet.propTypes = {
    character: PropTypes.object,
    selected: PropTypes.number,
    setSelected: PropTypes.func,
    updateCharacters: PropTypes.func,
    currentList: PropTypes.array,
    updateSelector: PropTypes.func

}

function CreateStage () {

    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [characterList, setCharacterList] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(-1);
    const imageInput = useRef(null);
    const nameInput = useRef(null);
    const gamePortrait = useRef(null);
    const selector = useRef(null);
    const [selectorStatus, setSelectorStatus] = useState(null);
    const [updatePosition, setUpdatePosition] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(selector.current !== null && updatePosition !== null)
        {
            if(selectorStatus)
            {
                selector.current.style.left = updatePosition.x + 'px';
                selector.current.style.top = updatePosition.y + 'px';
                setSelectorStatus(updatePosition);
            }
        }
    }, [updatePosition]);

    let imageContent = <div className='background paragraph-background'>
        <p>Preview image</p>
    </div>
    if(imageUrl)
    {
        if(imageLoaded)
        {
            imageContent = <img className='background' src={imageUrl} />;
        } else {
            imageContent = <div className='background paragraph-background'>
                <p>Loading image...</p>
                <img style={{visibility: "hidden"}} className='background' src={imageUrl} onLoad={() => { setImageLoaded(true); }} />
            </div>
        }
    }

    let characterListContent = '';
    if(characterList.length > 0)
    {
        characterListContent = characterList.map((character) => {
            return <CharacterSheet key={character.id} character={character} selected={selectedCharacter} 
            setSelected={setSelectedCharacter} updateCharacters={setCharacterList} currentList={characterList}
            updateSelector={setUpdatePosition} />;
        });        
    }

    let buttonDisplay = { display: 'block' };
    if(characterList && characterList.length >= 5)
    {
        buttonDisplay = { display: 'none' };
    }

    let errorDisplay = { display: 'none' };
    let errorContent = '';
    if(errorMessage)
    {
        errorDisplay = { display: 'block' };
        errorContent = <Fragment>
            <strong>{'Error: '}</strong>
            {errorMessage}
        </Fragment>;
    }

    return <>
    <header className='header-container'>
        <div className='header-content'>Where&apos;s Waldo?</div>
    </header>
    <main className='main-container'>
        <div ref={gamePortrait} className='game-portrait' onClick={(event) => { 
            if(imageLoaded)
            {
                onClickPortrait(event);
            }
        }}>
            {imageContent}
            <div ref={selector} className='current-position-selector'>
            </div>
        </div>
        <div className='stage-selector create'>
            <div className='stage-selector-caption-create'>Stage Information</div>
            <div className='stage-selector-item stage-error' style={errorDisplay}>
                {errorContent}
            </div>
            <div className='stage-selector-item'>
                <label htmlFor='stageName'>Stage name</label>
                <input ref={nameInput} type='text' id='stageName' name='stage-name' />
            </div>
            <div className='stage-selector-item'>
                <label htmlFor='imageUrl'>Image url</label>
                <input ref={imageInput} type='text' id='imageUrl' name='image-url' onChange={() => {
                    if(imageInput.current)
                    {
                        setImageUrl(imageInput.current.value);
                        setImageLoaded(false);
                    }
                }} />
            </div>
            <div className='stage-selector-item'>
                <div className='stage-selector-item-title'>Character list ({characterList.length}/5)</div>
                <div className='stage-selector-item-content'>
                    <button style={buttonDisplay} type='button' onClick={() => {
                        if(characterList.length < 5)
                        {
                            let nextId = 1;
                            if(characterList.length > 0)
                            {
                                nextId = characterList[characterList.length - 1].id + 1;                                
                            }

                            const character = {
                                id: nextId,
                                name: 'Unnamed',
                                position: null
                            }

                            const listCopy = [...characterList];
                            listCopy.push(character);

                            setCharacterList(listCopy);
                            setSelectedCharacter(nextId);
                        }
                    }}>Add new character</button>
                </div>
                <div className='stage-selector-character-list'>
                    {characterListContent}
                </div>
            </div>
            <div className='stage-selector-item'>
                <div className='stage-selector-item-title-small'>Reminder: the stage will be manually reviewed before being shown on the home page.</div>
                <div className='stage-selector-item-content'>
                    <button style={buttonDisplay} type='button' onClick={() => { sendStage(); }}>Send stage</button>
                </div>
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
                    if(!selectorStatus)
                    {
                        selector.current.style.display = 'flex';
                    }
                    selector.current.style.left = clientX + 'px';
                    selector.current.style.top = clientY + 'px';
                    const statusObject = {
                        x: clientX,
                        y: clientY,
                        relativeX: relativeClientX
                    }

                    if(setSelectedCharacter)
                    {
                        // update position
                        const listCopy = characterList.filter((char) => {
                            return (selectedCharacter !== char.id);
                        });

                        const characterCopy = {
                            id: selectedCharacter,
                            name: characterList.find((char) => char.id === selectedCharacter).name,
                            position: statusObject
                        }

                        listCopy.push(characterCopy);

                        listCopy.sort((a, b) => a.id - b.id);

                        setCharacterList(listCopy);                    
                    }

                    setSelectorStatus(statusObject);
                }
            }
        }
    }

    function sendStage()
    {
        // send stage to the server
        if(nameInput.current && imageInput.current)
        {
            if(imageLoaded === false || imageInput.current.value !== null && imageInput.current.value.length === 0)
            {
                setErrorMessage('Please input a valid image.');
            } else if(nameInput.current.value == null || nameInput.current.value.length === 0)
            {
                setErrorMessage('Please input a valid stage name.');
            } else if(characterList.length === 0)
            {
                setErrorMessage('Please add at least one character.');
            } else if(characterList.length > 5)
            {
                setErrorMessage('Please add a valid number of characters.');
            } else {
                let validCharacters = true;
                characterList.forEach((char) => {
                    if(char.position === null)
                    {
                        validCharacters = false;
                    }
                });

                if(!validCharacters)
                {
                    setErrorMessage('All characters must have their position set.');
                } else {
                    // try to upload to the DB
                    setErrorMessage(null);

                    const request = {};
                    request.name = nameInput.current.value;
                    request.imageUrl = imageInput.current.value;
                    request.characters = characterList;

                    fetch("https://wheres-waldo-king-07ecd83b7b71.herokuapp.com/stage/add_stage", { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: "cors",
                        dataType: 'json',
                        body: JSON.stringify(request),
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
                            if(response.responseStatus === 'stageAdded')
                            {
                                // redirect
                                navigate("/");
                            } else if(response.responseStatus === 'stageAddError')
                            {
                                setErrorMessage(response.errors[0]);
                            }
                        }            
                    })
                    .catch((error) => {
                        throw new Error(error);
                    });
                }
            }
        }
    }
}

export default CreateStage