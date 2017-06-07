import { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';

import withWidth, { SMALL } from '../lib/with-width';
import * as sidebarActions from '../modules/sidebar';

import Sidebar from '../components/Sidebar';

class SidebarContainer extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired
  }

  componentWillMount() {
    const { 
      width,
      SidebarActions
    } = this.props;

    if (width !== SMALL) {
      SidebarActions.setVisibility(true);
    }
  }

  handleToggle = () => {
    const { SidebarActions } = this.props;
    SidebarActions.toggle();
  }

  handleSelect = (view) => {
    const { 
      width,
      SidebarActions
    } = this.props;

    SidebarActions.setView(view);
    if (width === SMALL) {
      SidebarActions.toggle();
    }
  }

  render() {
    const {
      visible,
      view
    } = this.props;

    const {
      handleToggle,
      handleSelect
    } = this;

    return (
      <Sidebar 
        visible={visible}
        selected={view}
        onSelect={handleSelect}/>
    )
  }
}

const enhance = compose(
  withWidth(),
  connect(
    (state) => ({
      visible: state.sidebar.get('isOpen'),
      view: state.sidebar.get('view')
    }),
    (dispatch) => ({
      SidebarActions: bindActionCreators(sidebarActions, dispatch)
    })
  )
);

export default enhance(SidebarContainer);