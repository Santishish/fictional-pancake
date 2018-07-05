import React, {Component} from 'react';
import EventListItem from "./EventListItem";
import InfiniteScroller from 'react-infinite-scroller';

class EventList extends Component {
    render() {
        const {events, getNextEvents, moreEvents, loading} = this.props;
        return (
            <div>
                {events && events.length !== 0 &&
                <InfiniteScroller pageStart={0} loadMore={getNextEvents} hasMore={!loading && moreEvents} initialLoad={false}>
                    {events && events.map(event => (
                        <EventListItem key={event.id} event={event}/>
                    ))}
                </InfiniteScroller>}

            </div>
        );
    }
}

export default EventList;