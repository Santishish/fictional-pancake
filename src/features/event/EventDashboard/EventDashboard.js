import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';
import {firestoreConnect, isLoaded, isEmpty} from 'react-redux-firebase';
import {connect} from "react-redux";
import EventList from "../EventList/EventList";
import EventActivity from "../EventActivity/EventActivity";

import LoadingComponent from "../../../app/layout/LoadingComponent";

class EventDashboard extends Component {
    state = {
        loading: false
    };

    render() {
        const {events} = this.props;
        if (!isLoaded(events) || isEmpty(events)) return <LoadingComponent inverted/>;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList
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
});

export default connect(mapStateToProps)(firestoreConnect([{collection: 'events'}])(EventDashboard));