import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from "react-redux";
import EventList from "../EventList/EventList";
import {deleteEvent} from "../eventActions";
import EventActivity from "../EventActivity/EventActivity";

// import LoadingComponent from "../../../app/layout/LoadingComponent";

class EventDashboard extends Component {

    handleDeleteEvent = (eventId) => () => {
        this.props.deleteEvent(eventId);
    };

    render() {
        const {events} = this.props;
        // if (loading) return <LoadingComponent inverted/>;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList deleteEvent={this.handleDeleteEvent}
                               events={events}/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventActivity/>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    events: state.firestore.ordered.events,
    // loading: state.async.loading
});

const mapDispatchToProps = {
    deleteEvent
};


export default connect(mapStateToProps, mapDispatchToProps)(firestoreConnect([{collection: 'events'}])(EventDashboard));