import React, { Component } from 'react'
import { LayerReactComponents, layerClient } from '../../get-layer';

const { IdentityList } = LayerReactComponents;

class CreateConversationDialog extends Component {
  onSave = () => {
    if (this.props.conversationId) {
      const conversation = layerClient.getConversation(this.props.conversationId);
      if (conversation) {
        conversation.replaceParticipants(this.state.selectedIdentities);
        conversation.setMetadataProperties({ conversationName: this.state.conversationName });
        if (this.props.onSave) this.props.onSave(conversation);
      }
    } else if (this.state.selectedIdentities.length) {
      const conversation = layerClient.createConversation({
        participants: this.state.selectedIdentities,
        distinct: this.state.selectedIdentities.length === 1,
        metadata: {
          conversationName: this.state.conversationName,
        }
      });
      if (this.props.onSave) this.props.onSave(conversation);
    }
  }

  componentWillMount() {
    const conversation = this.props.conversationId ? layerClient.getConversation(this.props.conversationId) : null;
    if (conversation && conversation.isLoading) {
      conversation.once('conversations:loaded', () => {
        this.setState({
          selectedIdentities: conversation ? conversation.participants : [],
        });
      }, this);
    } else {
      this.setState({
        selectedIdentities: conversation ? conversation.participants : [],
      });
    }
  }

  /**
   * Extract the Identity object before forwarding the callback up to the parent.
   */
  onSelectionChange = (event) => {
    this.setState({ selectedIdentities: event.target.selectedIdentities });
  }

  /**
   * Extract the identity object before forwarding the callback up to the parent.
   */
  onIdentityDeselected = (event) => {
    const identity = event.detail.item.toObject();
    if (this.props.onIdentitySelected) this.props.onIdentityDeselected(identity);
  }

  updateName = (event) => {
    const conversationName = event.target.value;
    this.setState({ conversationName });
  }

  onClose = (event) => {
    if (event.target.classList.contains('dialog')) this.props.onCancel();
  }

  /**
   * Render the Identity List Dialog
   */
  render() {
    const { selectedIdentities } = this.state;

    const conversation = this.props.conversationId ? layerClient.getConversation(this.props.conversationId) : null;

    return (
      <div onClick={this.onClose} className="dialog">
        <div className="participant-list-container dialog-container">
          <div className="panel-header">
            <span className="title">{conversation ? 'Select Participants' : 'Update Participants'}</span>
          </div>
          <IdentityList
            onIdentitySelectionComplete={this.onSelectionChange}
            selectedIdentities={selectedIdentities}
          />
          <div className="button-panel">
            <input
              defaultValue={conversation ? conversation.metadata.conversationName : ''}
              onKeyDown={() => setTimeout(() => this.updateName, 1)}
              onChange={this.updateName}
              placeholder='Conversation title...' />
            <button onClick={this.onSave} className="button-ok">OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateConversationDialog;

