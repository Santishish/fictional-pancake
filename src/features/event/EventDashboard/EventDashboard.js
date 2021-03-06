import React, {Component} from 'react';
import {Grid, Loader} from 'semantic-ui-react';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from "react-redux";
import EventList from "../EventList/EventList";
import EventActivity from "../EventActivity/EventActivity";
import {getEventsForDashboard} from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";


class EventDashboard extends Component {

    state = {
        loading: true,
        moreEvents: false,
        loadedEvents: [],
        loadingMoreEvents: false,
        contextRef: {}
    };

    async componentDidMount() {
        let next = await this.props.getEventsForDashboard();
        if (next && next.docs && next.docs.length > 1) {
            this.setState({
                moreEvents: true,
                loading: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.events !== nextProps.events) {
            this.setState({
                loadedEvents: [...this.state.loadedEvents, ...nextProps.events],
                loadingMoreEvents: false
            });
        }
    }

    getNextEvents = async () => {
        const {events} = this.props;
        let lastEvent = events && events[events.length - 1];
        let next = await this.props.getEventsForDashboard(lastEvent);
        if (next && next.docs && next.docs.length <= 1) {
            this.setState({
                moreEvents: false
            });
        }
    };

    handleContextRef = (contextRef) => {
        this.setState({
            contextRef
        });
    };

    render() {
        const {activities} = this.props;
        const {moreEvents, loadedEvents, loading, contextRef} = this.state;
        if (loading) return <LoadingComponent inverted/>;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <div ref={this.handleContextRef}>
                        <EventList
                            events={loadedEvents} getNextEvents={this.getNextEvents} loading={this.state.loading}
                            moreEvents={moreEvents}/>
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventActivity activities={activities} contextRef={contextRef}/>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader active={this.state.loadingMoreEvents}/>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    events: state.events,
    activities: state.firestore.ordered.activity
});

const mapDispatchToProps = {
    getEventsForDashboard
};

const query = [
    {
        collection: 'activity',
        orderBy: ['timestamp', 'desc'],
        limit: 5
    }
];

export default connect(mapStateToProps, mapDispatchToProps)(firestoreConnect(query)(EventDashboard));