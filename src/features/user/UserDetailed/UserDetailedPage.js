import React, {Component} from 'react';
import {Grid} from "semantic-ui-react";
import {connect} from "react-redux";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedSidebar from "./UserDetailedSidebar";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedPhotos from "./UserDetailedPhotos";

class UserDetailedPage extends Component {

    render() {
        const {profile, photos} = this.props;

        return (
            <Grid>
                <UserDetailedHeader profile={profile}/>
                <UserDetailedDescription profile={profile}/>
                <UserDetailedSidebar/>
                {photos && photos.length > 0 &&
                <UserDetailedPhotos photos={photos}/>}
                <UserDetailedEvents/>
            </Grid>

        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos
});

const query = ({auth}) => {
    return [
        {
            collection: 'users',
            doc: auth.uid,
            subcollections: [{collection: 'photos'}],
            storeAs: 'photos'
        }
    ]
};

export default compose(connect(mapStateToProps), firestoreConnect(auth => query(auth)))(UserDetailedPage);
