import React from 'react'
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import { styles } from './styles.scss';

const Poster = () => {

    let meetingTitle;
    const meetingId = Auth.meetingID;
    const meetingObject = Meetings.findOne({
      meetingId,
    }, { fields: { 'meetingProp.name': 1, 'breakoutProps.sequence': 1} });
  
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
  
    console.log("Poster meetingId:", meetingId);
    console.log("Poster meetingObject:", meetingObject);
    console.log("Poster meetingTitle:", meetingTitle);
  
    const presentationTitleWithoutUID = meetingTitle.split("|")[0];
    const posterUID = meetingTitle.split("|scigentech|")[meetingTitle.split("|scigentech|").length - 1] || "epodemo2019.0020002";
    const prefix = posterUID.split(".")[0];
    console.log("Poster posterUID:", posterUID);
  
    return (
        <div className={styles.zoomWithoutContainer}>
            <img src={`https://epostersonline-2.s3-eu-west-1.amazonaws.com/${prefix}/${posterUID}.Full.png`} alt={presentationTitleWithoutUID} />
        </div>
    )
}

export default Poster
