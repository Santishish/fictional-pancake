import React, {Component} from 'react';
import {Button, Form, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import {createEvent, updateEvent} from "../eventActions";
import cuid from 'cuid';


class EventForm extends Component {

    state = {
        event: Object.assign({}, this.props.event)
    };

    onInputChange = (e) => {
        const newEvent = this.state.event;
        newEvent[e.target.name] = e.target.value;
        this.setState({
            event: newEvent
        });
    };

    onFormSubmit = (e) => {
        e.preventDefault();
        if (this.state.event.id) {
            this.props.updateEvent(this.state.event);
            this.props.history.goBack();
        } else {
            const newEvent = {
                ...this.state.event,
                id: cuid(),
                hostPhotoURL: '/assets/user.png'
            };

            this.props.createEvent(newEvent);
            this.props.history.push('/events');
        }
    };

    render() {
        const {event} = this.state;
        return (
            <Segment>
                <Form onSubmit={this.onFormSubmit}>
                    <Form.Field>
                        <label>Event Title</label>
                        <input value={event.title} onChange={this.onInputChange} name="title" placeholder="Event Title"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Event Date</label>
                        <input value={event.date} onChange={this.onInputChange} name="date" type="date" placeholder="Event Date"/>
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input value={event.city} onChange={this.onInputChange} name="city" placeholder="City event is taking place"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <input value={event.venue} onChange={this.onInputChange} name="venue" placeholder="Enter the Venue of the event"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Hosted By</label>
                        <input value={event.hostedBy} onChange={this.onInputChange} name="hostedBy" placeholder="Enter the name of person hosting"/>
                    </Form.Field>
                    <Button positive type="submit">
                        Submit
                    </Button>
                    <Button onClick={this.props.history.goBack} type="button">Cancel</Button>
                </Form>
            </Segment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const eventId = ownProps.match.params.id;
    let event = {
        title: '',
        date: '',
        city: '',
        venue: '',
        hostedBy: ''
    };
    if (event && state.events.length > 0){
        event = state.events.filter(event => event.id === eventId)[0];
    }

    return {
        event
    }
};

const mapDispatchToProps = {
    createEvent,
    updateEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(EventForm);