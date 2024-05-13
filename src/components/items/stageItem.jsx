import PropTypes from 'prop-types';
import '../../style/stageItem.css';

function StageItem({stage, updateSelectedStage})
{
    return <>
        <div className='stage-item' onClick={() => {
            updateSelectedStage(stage);
        }}>
            <div className='stage-caption'>
                <p>{stage.name}</p>
            </div>
            <img src={stage.image_url} alt='Stage Image' />            
        </div>
    </>

}

StageItem.propTypes = {
    stage: PropTypes.object,
    updateSelectedStage: PropTypes.func
}

export default StageItem;