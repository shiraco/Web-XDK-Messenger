/**
 * This UI Component manages the Layer Conversations.
 *
 * It provides a Conversation List on the left, and a Conversation View on the right.
 *
 * It also uses an Identity List via the EditCOnversationDialog.js file to create new Conversations.
 */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { layerClient, LayerReactComponents, Layer } from '../../get-layer';
import EditConversationDialog from './EditConversationDialog';
import getMenuOptions from './sample-menu';
import './message-handlers';

const { dateSeparator } = Layer.UI.UIUtils;
const { uuid } = Layer.Utils;

// Extract the Layer XDK UI Components that are to be used in this Project
const { Notifier, ConversationList, ConversationView, SendButton, FileUploadButton, MenuButton, Presence } = LayerReactComponents;

class Messenger extends Component {
  constructor (props) {
    super (props)
    this.state = {};
  }

  /**
   * As part of loading this Component, verify that we have an authenticated Client.
   *
   * Redirect to the Login page if we do not.
   *
   * Note that your production applications will _not_ send users to a Login page if their Layer Client isn't authenticated,
   * it will authenticate for them based on the session token they have with your own servers. Only if your *own* session is not authenticated
   * would you send users to a Login page.  But... this is a Demo.
   */
  componentWillMount() {
    // If not authenticated, redirect to the Login page
    if (!layerClient.isAuthenticated) {
      this.props.history.push({
        pathname: '/',
        previousLocation: { pathname: this.props.location.pathname }
      })
      return;
    }

    // If the path contains a Conversation ID, load that Conversation and then setup the conversation.
    // If the Conversations Query has already fetched all conversations, then this will already be present.
    // Else getConversation(id, true) will fetch it from the server and trigger "conversations:loaded" event when complete.
    if (this.props.match.params.conversationId) {
      this.conversation = layerClient.getConversation(this.props.match.params.conversationId, true);
      this.setupConversation();
    }
  }

  /**
   * Now that we have a Conversation, setup event handlers on it to detect when its loaded,
   * and when its `metadata` property has changed; metadata changes typically mean a Conversation Name change
   * that needs to be rerendered.
   *
   * Note: This works off of `this.conversation` as its input, and this value may be `null`
   */
  setupConversation() {
    const conversation = this.conversation;

    // If the conversation is still loading, wait for it to finish, and then set isLoaded to true
    if (conversation && conversation.isLoading) {
      conversation.once('conversations:loaded', () => {
        this.setState({
          isLoaded: true,
        });
      });
    }

    // Watch for any changes to the metadata and update the conversationName
    if (conversation) {
      conversation.on('conversations:change', (evt) => {
        if (evt.hasProperty('metadata')) {
          this.setState({ conversationName: conversation.metadata.conversationName });
        }
      }, this);
    }

    // Setup our inital state
    this.setState({
      conversationId: conversation ? uuid(conversation.id) : '',
      conversation,
      conversationName: conversation && conversation.metadata.conversationName,
      isLoaded: conversation && !conversation.isLoading,
    });
  }

  /**
   * Whenever a conversation is selected in the Conversation List, navigate to that Conversation.
   * This will cause `render` to be called, and the new Conversation ID to be passed to the Conversatin View.
   */
  onConversationSelected (e) {
    if (!e.detail.item) return
    const conversation = e.detail.item.toObject()
    this.props.history.push(`/conversations/${uuid(conversation.id)}`)
  }

  /**
   * Clear the selected conversation, navigates such that the `render` is called with no Conversation ID.
   */
  onConversationDeselected = () => {
    this.props.history.push('/conversations/');
    this.setState({
      conversationId: ''
    });
  }

  /**
   * Whenever properties change, determine if the Conversation ID has changed, and if so:
   *
   * * Unsubscribe to all events from the prior conversation
   * * Call setupConversation() with the new conversation
   */
  componentWillReceiveProps (props) {
    if (this.props.match.params.conversationId !== props.match.params.conversationId) {
      const conversationId = props.match.params.conversationId;
      const newConversation = conversationId ? layerClient.getConversation(conversationId) : null;
      if (this.conversation) this.conversation.off(null, null, this);
      this.conversation = newConversation;
      this.setupConversation();
    }
  }


  /**
   * Certain types of messages can be filtered out of the Conversation View.
   *
   * Note: this does not at this time filter them out of the Conversation List's Last Message.
   * Just return `false` to prevent a message from rendering.
   */
  filterMessages (message) {
    const model = message.createModel();
    return !model || !(model.getModelName() === 'ResponseModel' && !model.displayModel);

    // Uncomment this to hide Response Messages sent by this user
    // return !(model.getModelName() === 'ResponseModel' && (message.sender === layerClient.user || !model.displayModel));
  }

  /**
   * Toggle presence between BUSY and AVAILABLE
   */
  togglePresence = (event) => {
    event.preventDefault();
    var nextStatus = layerClient.user.status === Layer.Core.Identity.STATUS.AVAILABLE ?
      Layer.Core.Identity.STATUS.BUSY : Layer.Core.Identity.STATUS.AVAILABLE
    layerClient.user.setStatus(nextStatus);
  }

  /**
   * Start creating a Conversation. Shows the EditConversationDialog.
   */
  startCreateConversation = (event) => {
    event.preventDefault();
    this.setState({ showEditConversationDialog: true });
  }

  /**
   * Start editing a Conversation. Shows the EditConversationDialog.
   */
  startEditConversation = (event) => {
    event.preventDefault();
    this.setState({
      showEditConversationDialog: true,
      editConversationId: this.state.conversationId,
    });
  }

  /**
   * Dismiss the EditConversationDialog
   */
  cancelCreateConversation = () => {
    this.setState({ showEditConversationDialog: false });
  }

  /**
   * Once the EditConversationDialog reports back that the Conversation has been created,
   * update our state and our URL
   */
  onCreateConversation = (conversation) => {
    this.setState({
      conversationId: uuid(conversation.id),
      showEditConversationDialog: false,
      editConversationId: '',
    });
    this.props.history.push(`/conversations/${uuid(conversation.id)}`)
  }

  /**
   * Logout of the client and navigate to the Login page
   */
  logout = () => {
    layerClient.logout();
    this.props.history.push('/')
  }

  /**
   * When user clicks on a Toast or Desktop notification, update the selected Conversation
   */
  onNotificationClick = (event) => {
    this.props.history.push(`/conversations/${uuid(event.detail.item.conversationId)}`)
  }

  /**
   * When a new message arrives, notifiy the user if the Window/tab is in the background,
   * or the ConversationView is showing a different Conversation.
   */
  onMessageNotification = (event) => {
    if (event.detail.item.conversationId === this.state.conversationId && !event.detail.isBackground) {
      event.preventDefault();
    }
  }

  /**
   * Typically the title of a Conversation is stored in `conversation.metadata.converstationName.
   * However, if there is no name, just render a list of participants as the name.
   */
  getTitle() {
    const activeConversation = this.state.conversation;
    var title;

    if (activeConversation) {

      // If the conversation is loading from the server, then just hold off rendering anything other than a placeholder
      if (activeConversation.isLoading) {
        title = '...';
      } else {

        // If there is a conversation name, use it
        if (this.state.conversationName) {
          title = this.state.conversationName;
        }

        // If there is not a conversationName, gather relevant participant names and concatenate them together
        else {
          title = activeConversation.participants
          .filter(user => user !== layerClient.user)
          .map(user => user.displayName)
          .join(', ');
        }
      }
    }

    // Else there is no conversation, prompt the user to select something
    else {
      title = '← Create a new conversation or select a conversation from the list.';
    }
    return title;
  }

  /**
   * The Conversation View allows for various regions of its panels and the Message Items in its list to be customized.
   *
   * Gather those customizations here.
   *
   * Initially we just add a Send Button, File Upload Button and our Samples Menu button to the Compose Bar.
   */
  customizeConversationView() {
    return {
      composerButtonPanelRight: () => {
        return (<div>
          <SendButton />
          <FileUploadButton multiple="true" />
          <MenuButton
          getMenuItems={this.generateMenu.bind(this)}
          />
        </div>);
      },
    };
  }

  generateMenu() {
    if (this.state.conversation) {
      return getMenuOptions(this.state.conversation);
    }
  }

  /**
   * This app uses a dialog to create and edit Conversation participants and Conversation names.
   */
  renderDialog() {
    return <EditConversationDialog
      conversationId={this.state.editConversationId}
      onCancel={this.cancelCreateConversation}
      onSave={this.onCreateConversation}
    />;
  }

  /**
   * Render the left panel which contains the Conversation List and the Header over the list
  */
  renderLeftPanel() {
    const activeConversationId = this.state.conversationId ? 'layer:///conversations/' + this.state.conversationId : '';

    return <div className="left-panel">
      <div className='panel-header conversations-header'>
        <a href='#' onClick={this.logout} className='logout'>
          <i className="icon fa fa-sign-out"></i>
        </a>
        <Presence
          item={layerClient.user}
          onPresenceClick={this.togglePresence} />

        <div className='title'>{layerClient.user ? layerClient.user.displayName : '************'}</div>
        <a href='#' onClick={this.startCreateConversation}>
          <i className="icon fa fa-pencil-square-o"></i>
        </a>
      </div>

      <ConversationList
        selectedConversationId={this.state.conversationId ? activeConversationId : null}
        onConversationSelected={(e) => this.onConversationSelected(e)} />
    </div>;
  }

  /**
   * Render the right panel which consists of the Conversation View and the header over the Conversation View
   */
  renderRightPanel() {
    const activeConversationId = this.state.conversationId ? 'layer:///conversations/' + this.state.conversationId : '';

    return <div className="right-panel">
      <div className='panel-header conversation-header'>
        <a href='#' onClick={this.onConversationDeselected}>
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </a>
        <div className='title'>{this.getTitle()}</div>
        <a href='#' onClick={this.startEditConversation}>
          <i className="icon fa fa-pencil-square-o"></i>
        </a>
      </div>

      <ConversationView
        ref="conversationPanel"
        queryFilter={(message) => this.filterMessages(message)}
        replaceableContent={this.customizeConversationView()}
        onRenderListItem={dateSeparator}
        conversationId={activeConversationId}
      />
    </div>;
  }

  render() {
    // Setup the CSS Classes for the root element
    const isMobile = navigator.userAgent.match(/android/i) || navigator.platform === 'iPhone' || navigator.platform === 'iPad';
    let rootClasses = 'messenger';
    if  (this.state.conversationId) rootClasses += ' has-conversation';
    if (isMobile) rootClasses += ' is-mobile';

    return <div className={rootClasses}>
      <Notifier
        notifyInForeground="toast"
        onMessageNotification={this.onMessageNotification}
        onNotificationClick={this.onNotificationClick} />
      {this.state.showEditConversationDialog ? this.renderDialog() : null}
      {this.renderLeftPanel()}
      {this.renderRightPanel()}
    </div>
  }
}

export default Messenger
