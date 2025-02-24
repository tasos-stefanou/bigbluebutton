import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';
import AudioService from '/imports/ui/components/audio/service';
import { styles } from './styles';

const messages = defineMessages({
  noViewers: {
    id: 'app.modal.randomUser.noViewers.description',
    description: 'Label displayed when no viewers are avaiable',
  },
  selected: {
    id: 'app.modal.randomUser.selected.description',
    description: 'Label shown to the selected user',
  },
  randUserTitle: {
    id: 'app.modal.randomUser.title',
    description: 'Modal title label',
  },
  whollbeSelected: {
    id: 'app.modal.randomUser.who',
    description: 'Label shown during the selection',
  },
  onlyOneViewerTobeSelected: {
    id: 'app.modal.randomUser.alone',
    description: 'Label shown when only one viewer to be selected',
  },
  reselect: {
    id: 'app.modal.randomUser.reselect.label',
    description: 'select new random user button label',
  },
  ariaModalTitle: {
    id: 'app.modal.randomUser.ariaLabel.title',
    description: 'modal title displayed to screen reader',
  },
});

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  mountModal: PropTypes.func.isRequired,
  numAvailableViewers: PropTypes.number.isRequired,
  randomUserReq: PropTypes.func.isRequired,
};

class RandomUserSelect extends Component {
  constructor(props) {
    super(props);

    if (props.currentUser.presenter) {
      props.randomUserReq();
    }

    this.state = {
      count: 0,
    };

    this.play = this.play.bind(this);
  }

  iterateSelection() {
    if (this.props.mappedRandomlySelectedUsers.length > 1) {
      const that = this;
      setTimeout(delay(that.props.mappedRandomlySelectedUsers, 1), that.props.mappedRandomlySelectedUsers[1][1]);
      function delay(arr, num) {
        that.setState({
          count: num,
        });
        if (num < that.props.mappedRandomlySelectedUsers.length - 1) {
          setTimeout(() => { delay(arr, num + 1); }, arr[num + 1][1]);
        }
      }
    }
  }

  componentDidMount() {
    if (!this.props.currentUser.presenter) {
      this.iterateSelection();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentUser.presenter && this.state.count == 0) {
      this.iterateSelection();
    }

    if (prevState.count !== this.state.count) {
      this.play();
    }
  }

  play() {
    AudioService.playAlertSound(`${Meteor.settings.public.app.cdn
      + Meteor.settings.public.app.basename
      + Meteor.settings.public.app.instanceId}`
      + '/resources/sounds/Poll.mp3');
  }

  reselect() {
    this.setState({
      count: 0,
    });
    this.props.randomUserReq();
  }

  render() {
    const {
      intl,
      mountModal,
      numAvailableViewers,
      currentUser,
      clearRandomlySelectedUser,
      mappedRandomlySelectedUsers,
    } = this.props;

    if (mappedRandomlySelectedUsers.length < this.state.count + 1) return null;

    const selectedUser = mappedRandomlySelectedUsers[this.state.count][0];
    const countDown = mappedRandomlySelectedUsers.length - this.state.count - 1;

    let viewElement;

    const amISelectedUser = currentUser.userId === selectedUser.userId;
    if (numAvailableViewers < 1 || (currentUser.presenter && amISelectedUser)) { // there's no viewers to select from,
      // or when you are the presenter but selected, which happens when the presenter ability is passed to somebody
      // and people are entering and leaving the meeting
      // display modal informing presenter that there's no viewers to select from
      viewElement = (
        <div className={styles.modalViewContainer}>
          <div className={styles.modalViewTitle}>
            {intl.formatMessage(messages.randUserTitle)}
          </div>
          <div>{intl.formatMessage(messages.noViewers)}</div>
        </div>
      );
    } else { // viewers are available
      if (!selectedUser) return null; // rendering triggered before selectedUser is available

      // display modal with random user selection
      viewElement = (
        <div className={styles.modalViewContainer}>
          <div className={styles.modalViewTitle}>
            {countDown == 0
              ? amISelectedUser
                ? `${intl.formatMessage(messages.selected)}`
                : numAvailableViewers == 1 && currentUser.presenter
                  ? `${intl.formatMessage(messages.onlyOneViewerTobeSelected)}`
                  : `${intl.formatMessage(messages.randUserTitle)}`
              : `${intl.formatMessage(messages.whollbeSelected)} ${countDown}`}
          </div>
          <div aria-hidden className={styles.modalAvatar} style={{ backgroundColor: `${selectedUser.color}` }}>
            {selectedUser.name.slice(0, 2)}
          </div>
          <div className={styles.selectedUserName}>
            {selectedUser.name}
          </div>
          {currentUser.presenter
            && countDown == 0
            && (
            <Button
              label={intl.formatMessage(messages.reselect)}
              color="primary"
              size="md"
              className={styles.selectBtn}
              onClick={() => this.reselect()}
            />
            )}
        </div>
      );
    }

    return (
      <Modal
        hideBorder
        onRequestClose={() => {
          if (currentUser.presenter) clearRandomlySelectedUser();
          mountModal(null);
        }}
        contentLabel={intl.formatMessage(messages.ariaModalTitle)}
      >
        {viewElement}
      </Modal>
    );
  }
}

RandomUserSelect.propTypes = propTypes;
export default injectIntl(RandomUserSelect);
