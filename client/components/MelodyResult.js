import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Icon, Modal } from 'semantic-ui-react';
import Tone from 'Tone';
import NoteGrid from './NoteGrid';
import PreviewMelody from './PreviewMelody';
import { selectMelody, removeMelody } from '../store/melody';

/**
 * COMPONENT
 */

export class MelodyResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalId: null
    };
  }
  handleOpen = (midiDataObject, modalId) => {
    Promise.resolve(this.props.selectMelody(midiDataObject))
    .then(() => {
      this.setState({ modalOpen: true, modalId });
    });
  };

  handleClose = () => {
    this.setState({ modalOpen: false, modalId: null }, () => {
      this.props.removeMelody();
    });
  }

  createTableCells(arr) {
    return arr.map((num, i) => {
      return <Table.Cell key={i}>{num}</Table.Cell>;
    });
  }

  playExampleTone = () => {
    console.log('clicked');
    // playTone();
  };

  render() {

    if (!this.props.melodies.length) {
      return (
        <div>
          <h6 style={{margin: '25px'}}>Results will display here.</h6>
        </div>
      );
    }

    return (
      <div id="result-wrapper">
        {this.props.melodies.map((midiDataObject, i) => {
          return (
            <div key={i}>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Pitch</Table.Cell>
                    {this.createTableCells(midiDataObject.pitchNamesWithOctave)}
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>MIDI Code</Table.Cell>
                    {this.createTableCells(midiDataObject.midiCodeArray)}
                  </Table.Row>
                </Table.Body>
              </Table>
              <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}
                trigger={
                  <Button
                    icon
                    labelPosition="left"
                    color="blue"
                    onClick={() => this.handleOpen(midiDataObject, i)}
                  >
                    <Icon name="play" />
                    PREVIEW
                  </Button>
                }
                closeIcon
              >
              {
                this.state.modalId === i &&
                <Modal.Content>
                <PreviewMelody />
                </Modal.Content>
              }
                </Modal>

              <a
                className="download"
                title="Download"
                href={midiDataObject.midiFile}
              >
                <Button icon labelPosition="left" color="grey">
                  <Icon name="download" />
                  DOWNLOAD
                </Button>
              </a>
            </div>
          );
        })}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    melodies: state.melodies
  };
};

const mapDispatch = dispatch => {
  return {
    selectMelody(melody) {
      return dispatch(selectMelody(melody));
    },
    removeMelody() {
      return dispatch(removeMelody());
    }
  };
};

export default connect(mapState, mapDispatch)(MelodyResult);
