import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { 
  MODEL,
  fetchSubscribers,
  fetchSubscriber, 
  createSubscriber,
  updateSubscriber
} from 'modules/crud/subscriber';

import {
  clearActionStatus
} from 'modules/crud/actions';

import { 
  select, 
  selectActionStatus 
} from 'modules/crud/selectors';

import { Subscriber } from 'components';

const formData = {
  "security": {
    k: "465B5CE8 B199B49F AA5F0A2E E238A6BC",
    op: "5F1D289C 5D354D0A 140C2548 F5F3E3BA",
    amf: "8000"
  },
  "ue_ambr": {
    "max_bandwidth_ul": 1024000,
    "max_bandwidth_dl": 1024000
  },
  "pdn": [
    {
      "apn": "internet",
      "qos": {
        "qci": 9,
        "arp": {
          "priority_level": 8
        }
      },
      "pdn_ambr": {
        "max_bandwidth_ul": 1024000,
        "max_bandwidth_dl": 1024000
      }
    }
  ]
}

class Document extends Component {
  static propTypes = {
    action: PropTypes.string,
    visible: PropTypes.bool, 
    onHide: PropTypes.func, 
    onSubmit: PropTypes.func,
  }

  state = {
    formData,
    disableSubmitButton: true,
    disableValidation: false
  }

  componentWillReceiveProps(nextProps) {
    const { subscriber, status } = nextProps
    const { dispatch, action, onHide } = this.props

    if (subscriber.needsFetch) {
      dispatch(subscriber.fetch)
    }

    if (this.props.visible != nextProps.visible) {
      if (subscriber.data) {
        this.setState({ formData: subscriber.data })
      } else {
        this.setState({ formData });
      }
    }

    if (status.response) {
      dispatch(clearActionStatus(MODEL, action));
      onHide();
    }
  }

  validate = (formData, errors) => {
    const { subscribers, action, status } = this.props;
    const { disableValidation } = this.state;
    const { imsi } = formData;

    if (action === 'create' && disableValidation !== true && 
      subscribers && subscribers.data &&
      subscribers.data.filter(subscriber => subscriber.imsi === imsi).length > 0) {
      errors.imsi.addError(`'${imsi}' is duplicated`);
    }

    return errors;
  }

  handleChange = (formData, errors) => {
    let disableSubmitButton = (Object.keys(errors).length > 0);
    // I think there is a bug in React or Jsonschema library
    // For workaround, I'll simply add 'formData' in setState
    this.setState({
      disableSubmitButton,
      formData
    });
  }

  handleSubmit = (formData) => {
    const { dispatch, action, onHide } = this.props;

    this.setState({ disableValidation: true })

    if (action === 'create') {
      dispatch(createSubscriber({}, formData));
    } else if (action === 'update') {
      dispatch(updateSubscriber(formData.imsi, {}, formData));
    } else {
      throw new Error(`Action type '${action}' is invalid.`);
    }
  }

  render() {
    const {
      validate,
      handleChange,
      handleSubmit
    } = this;

    const { 
      visible,
      action,
      status,
      subscriber,
      onHide
    } = this.props

    return (
      <Subscriber.Edit
        visible={visible} 
        action={action}
        formData={this.state.formData}
        isLoading={subscriber.isLoading && !status.pending}
        disableSubmitButton={this.state.disableSubmitButton}
        validate={validate}
        onHide={onHide}
        onChange={handleChange}
        onSubmit={handleSubmit} />
    )
  }
}

Document = connect(
  (state, props) => ({ 
    subscribers: select(fetchSubscribers(), state.crud),
    subscriber: select(fetchSubscriber(props.imsi), state.crud),
    status: selectActionStatus(MODEL, state.crud, props.action)
  })
)(Document);

export default Document;