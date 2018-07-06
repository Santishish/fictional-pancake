import React, { Component } from 'react';
import {Button, Form} from "semantic-ui-react";
import { Field, reduxForm } from 'redux-form';
import TextArea from "../../../app/common/form/TextArea";

class EventDetailedChatForm extends Component {

    handleCommentSubmit = values => {
        const {addEventComment, reset, eventId, closeForm, parentId} = this.props;
        addEventComment(eventId, values, parentId);
        reset();
        if (parentId !== 0) {
            closeForm();
        }
    };

    render() {
        const {handleSubmit, pristine, submitting} = this.props;
        return (
            <Form onSubmit={handleSubmit(this.handleCommentSubmit)}>
                <Field style={{marginTop: "1rem"}} name="comment" type="text" component={TextArea} rows={2}/>
                <Button
                    disabled={pristine || submitting}
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    primary
                />
            </Form>
        );
    }
}

export default reduxForm({Fields: 'comment'})(EventDetailedChatForm);