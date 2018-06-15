import React, {Component} from 'react';
import {Button, Form, Segment, Grid, Header} from "semantic-ui-react";
import {connect} from "react-redux";
import {reduxForm, Field} from 'redux-form';
import {createEvent, updateEvent} from "../eventActions";
import {composeValidators, combineValidators, isRequired, hasLengthGreaterThan} from 'revalidate';
import cuid from 'cuid';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import moment from 'moment';

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Please provide a category'}),
    description: composeValidators(
        isRequired({message: 'Please enter a description'}),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date')
});

class EventForm extends Component {

    render() {
        const {invalid, submitting, pristine} = this.props;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <Segment>
                        <Header sub color='teal' content='Event Details'/>
                        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                            <Form.Field>
                                <label>Event Title</label>
                                <Field name='title' type='text' component={TextInput}
                                       placeholder='Give your event a name'/>
                            </Form.Field>
                            <Form.Field>
                                <label>Event Category</label>
                                <Field name='category' type='text' component={SelectInput}
                                       options={category}
                                       placeholder='What is your event about'/>
                            </Form.Field>
                            <Form.Field>
                                <label>Description</label>
                                <Field name='description' type='text' rows={3} component={TextArea}
                                       placeholder='Tell us about your event'/>
                            </Form.Field>
                            <Header sub color='teal' content='Event Location Details'/>
                            <Form.Field>
                                <label>City</label>
                                <Field name='city' type='text' component={TextInput} placeholder='Event City'/>
                            </Form.Field>
                            <Form.Field>
                                <label>Venue</label>
                                <Field name='venue' type='text' component={TextInput} placeholder='Event Venue'/>
                            </Form.Field>
                            <Form.Field>
                                <label>Event Date</label>
                                <Field name='date' type='text' component={DateInput} dateFormat='YYYY-MM-DD HH:mm'
                                       timeFormat='HH:mm' showTimeSelect
                                       placeholder='Event Date and Time'/>
                            </Form.Field>
                            <Button disabled={invalid || submitting || pristine} positive type="submit">
                                Submit
                            </Button>
                            <Button onClick={this.props.history.goBack} type="button">Cancel</Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }

    onFormSubmit = (values) => {
        values.date = moment(values.date).format();
        if (this.props.initialValues.id) {
            this.props.updateEvent(values);
            this.props.history.goBack();
        } else {
            const newEvent = {
                ...values,
                id: cuid(),
                hostPhotoURL: '/assets/user.png',
                hostedBy: 'Santiago'
            };

            this.props.createEvent(newEvent);
            this.props.history.push('/events');
        }
    };
}

const mapStateToProps = (state, ownProps) => {
    const eventId = ownProps.match.params.id;
    let event = {};
    if (eventId && state.events.length > 0) {
        event = state.events.filter(event => event.id === eventId)[0];
    }

    return {
        initialValues: event
    }
};

const mapDispatchToProps = {
    createEvent,
    updateEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'eventForm',
    enableReinitialize: true,
    validate
})(EventForm));