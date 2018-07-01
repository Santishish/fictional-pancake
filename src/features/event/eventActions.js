import {toastr} from 'react-redux-toastr';
import {createNewEvent} from "../../app/common/util/helpers";
import moment from "moment";

export const createEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        let newEvent = createNewEvent(user, photoURL, event);
        try {
            let createdEvent = await firestore.add(`events`, newEvent);
            await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true
            });
            toastr.success('Success!', 'Event has been created')
        } catch (e) {
            toastr.error('Oops!', 'Something went wrong');
        }
    };
};

export const updateEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        if (event.date !== getState().firestore.ordered.events[0].date) {
            event.date = moment(event.date).toDate();
        }
        try {
            await firestore.update(`events/${event.id}`, event);
            toastr.success('Success!', 'Event has been updated')
        } catch (e) {
            toastr.error('Oops!', 'Something went wrong');
        }
    };
};

export const cancelToggle = (cancelled, eventId) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const message = cancelled ? 'Are you sure you want to cancel the event?' : 'This will reactivate the event - are you sure?';
        try {
            toastr.confirm(message, {
                    onOk: () => firestore.update(`events/${eventId}`, {
                        cancelled
                    })
                });

        } catch (e) {
            console.log(e);
        }
    };