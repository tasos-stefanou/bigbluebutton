import React from 'react';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import { styles } from './styles.scss';
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, fitSelection, zoomOnViewerCenter, fitToViewer} from 'react-svg-pan-zoom';
import {useRef, useState, useEffect} from 'react';
import {ReactSvgPanZoomLoader} from 'react-svg-pan-zoom-loader'


const Poster = () => {

  const Viewer = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE)
  const [value, setValue] = useState(INITIAL_VALUE)
  
  useEffect(() => {
    Viewer.current.fitToViewer();
  }, []);

  let meetingTitle;
  const meetingId = Auth.meetingID;
  const meetingObject = Meetings.findOne({
    meetingId,
  }, { fields: { 'meetingProp.name': 1, 'breakoutProps.sequence': 1 } });

  if (meetingObject != null) {
    meetingTitle = meetingObject.meetingProp.name;
    //   let titleString = `${CLIENT_TITLE} - ${meetingTitle}`;
    //   if (meetingObject.breakoutProps) {
    //     const breakoutNum = meetingObject.breakoutProps.sequence;
    //     if (breakoutNum > 0) {
    //       titleString = `${breakoutNum} - ${titleString}`;
    //     }
    //   }
    //   document.title = titleString;
  }

  
  const s3BucketURL = 'https://svg-test.s3-eu-west-1.amazonaws.com';
  //const presentationTitleWithoutUID = meetingTitle.split('|')[0];
  const posterUID = meetingTitle.split('|scigentech|')[meetingTitle.split('|scigentech|').length - 1];
  const prefix = posterUID.split('.')[0];

  return (
    <div>

    <ReactSvgPanZoomLoader src={`${s3BucketURL}/${prefix}/${posterUID}.NORMAL.svg`} render= {(content) => (
      <ReactSVGPanZoom 
      ref={Viewer}
      width={1000} height={500}
      tool={tool} onChangeTool={setTool}
      value={value} onChangeValue={setValue}
      onZoom={e => console.log('zoom')}
      onPan={e => console.log('pan')}
      onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
        >
        <svg width={5250} height={2625}>
            {content}
        </svg>  
     </ReactSVGPanZoom>
    )}/>

    </div>
  );

};

export default Poster;
