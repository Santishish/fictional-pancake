import moment from 'moment';
import {toastr} from "react-redux-toastr";
import cuid from 'cuid';
import firebase from '../../app/config/firebase';
import {FETCH_EVENTS} from "../event/eventConstants";

export const updateProfile = (user) =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const {isLoaded, isEmpty, ...updatedUser} = user;
        if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
            updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
        }

        try {
            await firebase.updateProfile(updatedUser);
            toastr.success('Success', 'Profile updated');
        } catch (e) {
            console.error(e);
        }
    };

export const uploadProfileImage = (file, fileName) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const imageName = `${cuid()}_${fileName}`;
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;
        const options = {
            name: imageName
        };
        try {
            // Upload the file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);
            // Get URL of image
            let downloadURL = await uploadedFile.uploadTaskSnaphot.downloadURL;
            // Get user doc
            let userDoc = await firestore.get(`users/${user.uid}`);
            // Check if user has photo, if not update profile with new image
            if (!userDoc.data().photoURL) {
                await firebase.updateProfile({
                    photoURL: downloadURL
                });
                await user.updateProfile({
                    photoURL: downloadURL
                });
            }
            // Add new photo to photos collection
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, {
                name: imageName,
                url: downloadURL
            });
        } catch (e) {
            console.error(e);
            throw new Error('Problem uploading photo');
        }
    };

export const deletePhoto = (photo) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;

        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            })
        } catch (e) {
            console.error(e);
            throw new Error('Problem deleting the photo');
        }
    };

export const setMainPhoto = (photo) =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        try {
            return await firebase.updateProfile({
                photoURL: photo.url
            });
        } catch (e) {
            console.error(e);
            throw new Error('Error setting main photo');
        }
    };

export const goingToEvent = (event) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        const attendee = {
            going: true,
            joinDate: Date.now(),
            photoURL: photoURL || '/assets/user.png',
            displayName: user.displayName,
            host: false
        };
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: attendee
            });
            await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host: false
            });
            toastr.success('Success', 'You have signed up to the event');
        } catch (e) {
            console.log(e);
            toastr.error('Oops', 'Problem signing up to event');
        }
    };

export const cancelGoingToEvent = (event) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: firestore.FieldValue.delete()
            });
            await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
            toastr.success('Success', 'You have removed yourself from the event');
        } catch (e) {
            console.log(e);
            toastr.error('Oops', 'Something went wrong')
        }
    };

export const getUserEvents = (userUid, activeTab) =>
    async (dispatch, getState) => {
        const firestore = firebase.firestore();
        const today = new Date(Date.now());
        let eventsRef = firestore.collection('event_attendee');
        let query;
        switch (activeTab) {
            case 1: // Past events
                query = eventsRef.where('userUid', "==", userUid).where('eventDate', "<=", today).orderBy("eventDate", "desc");
                break;
            case 2: // Future events
                query = eventsRef.where('userUid', "==", userUid).where('eventDate', ">=", today).orderBy("eventDate");
                break;
            case 3: // Hosted events
                query = eventsRef.where('userUid', "==", userUid).where('host', "==", true).orderBy("eventDate", "desc");
                break;
            default:
                query = eventsRef.where('userUid', "==", userUid).orderBy("eventDate", "desc");
                break;
        }
        try {
            let querySnap = await query.get();
            let events = [];
            for (let i = 0; i < querySnap.docs.length; i++) {
                let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
                events.push({...evt.data(), id: evt.id});
            }
            dispatch({type: FETCH_EVENTS, payload: {events}});
        } catch (e) {
            console.error(e);
        }
    };

export const followUser = userToFollow => async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const following = {
        photoURL: userToFollow.photoURL || '/assets/user.png',
        city: userToFollow.city || 'unknown city',
        displayName: userToFollow.displayName
    };
    try {
        await firestore.set(
            {
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'following', doc: userToFollow.id}]
            },
            following
        );
    } catch (error) {
        console.log(error);
    }
};

export const unfollowUser  = (userToUnfollow) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        try {
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'following', doc: userToUnfollow.id}]
            })
        } catch (error) {
            console.log(error)
        }
    };