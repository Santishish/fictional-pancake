import React, {Component} from 'react';
import {Grid} from "semantic-ui-react";
import {connect} from "react-redux";
import {compose} from "redux";
import {firestoreConnect, isEmpty} from "react-redux-firebase";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedSidebar from "./UserDetailedSidebar";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedPhotos from "./UserDetailedPhotos";
import {userDetailedQuery} from "../userQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {getUserEvents, followUser, unfollowUser} from "../userActions";

class UserDetailedPage extends Component {

    state = {
        loadedEvents: true
    };

    async componentDidMount() {
        this.setState({
            loadedEvents: false
        });
        await this.props.getUserEvents(this.props.userUid);
        this.setState({
            loadedEvents: true
        });
    }

    changeTab = async(e, data) => {
        this.setState({
            loadedEvents: false
        });
        await this.props.getUserEvents(this.props.userUid, data.activeIndex);
        this.setState({
            loadedEvents: true
        });
    };

    render() {
        const {profile, photos, auth, match, requesting, events, followUser, following, unfollowUser} = this.props;
        const isCurrentUser = auth.uid === match.params.id;
        const loading = Object.values(requesting).some(a => a === true);
        const isFollowing = !isEmpty(following);

        if (loading) return <LoadingComponent inverted/>;
        return (
            <Grid>
                <UserDetailedHeader profile={profile}/>
                <UserDetailedDescription profile={profile}/>
                <UserDetailedSidebar profile={profile} followUser={followUser} unfollowUser={unfollowUser} isFollowing={isFollowing} isCurrentUser={isCurrentUser}/>
                {photos && photos.length > 0 &&
                <UserDetailedPhotos photos={photos}/>}
                <UserDetailedEvents loadedEvents={this.state.loadedEvents} events={events} changeTab={this.changeTab}/>
            </Grid>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let userUid = null;
    let profile = {};
    if (ownProps.match.params.id === state.auth.uid) {
        profile = state.firebase.profile;
    } else {
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
        userUid = ownProps.match.params.id;
    }
    return {
        profile,
        userUid,
        events: state.events,
        auth: state.firebase.auth,
        photos: state.firestore.ordered.photos,
        requesting: state.firestore.status.requesting,
        following: state.firestore.ordered.following
    }
};

const mapDispatchToProps = {
    getUserEvents,
    followUser,
    unfollowUser
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid, match)))(UserDetailedPage);
