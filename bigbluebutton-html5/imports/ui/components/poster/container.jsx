import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import { withTracker } from 'meteor/react-meteor-data';
import Poster from './component'

PosterContainer = () => {
    <Poster>
        
    </Poster>
}



export default withTracker(() => {
  
    let meetingTitle;
    const meetingId = Auth.meetingID;
    const meetingObject = Meetings.findOne({
      meetingId,
    }, { fields: { 'meetingProp.name': 1, 'breakoutProps.sequence': 1 } });
  
    if (meetingObject != null) {
      meetingTitle = meetingObject.meetingProp.name;
      let titleString = `${CLIENT_TITLE} - ${meetingTitle}`;
      if (meetingObject.breakoutProps) {
        const breakoutNum = meetingObject.breakoutProps.sequence;
        if (breakoutNum > 0) {
          titleString = `${breakoutNum} - ${titleString}`;
        }
      }
      document.title = titleString;
    }
  
    console.log("Poster meetingId:", meetingId);
    console.log("Poster meetingObject:", meetingObject);
    console.log("Poster meetingTitle:", meetingTitle);
  
    const presentationTitleWithoutUID = meetingTitle.split("|")[0];
    const posterUID = meetingTitle.split("|")[meetingTitle.split("|").length - 1] || "epodemo2019.0020002";
    console.log("Poster posterUID:", posterUID);
  
  
    return {
        posterUID
    };
  })(PosterContainer);