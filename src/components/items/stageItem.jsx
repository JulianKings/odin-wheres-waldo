import PropTypes from 'prop-types';
import '../../style/stageItem.css';

function StageItem({stage, updateSelectedStage})
{
    return <>
        <div className='stage-item' onClick={() => {
            updateSelectedStage(stage);
        }}>
            <p>{stage.name}</p>
            <img src={stage.image_url} alt='Stage Image' />            
        </div>
    </>

}

StageItem.propTypes = {
    stage: PropTypes.object,
    updateSelectedStage: PropTypes.func
}

export default StageItem;