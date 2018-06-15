import React from 'react';
import { Form, Label } from 'semantic-ui-react';

const TextArea = ({input, rows, type, placeholder, meta: {touched, error}}) => {
    return (
        <Form.Field error={touched && !!error} rows={rows}>
            <textarea {...input} placeholder={placeholder} rows={rows} style={{resize: 'none'}}/>
            {touched && error && <Label basic color='red'>{error}</Label>}
        </Form.Field>
    );
};

export default TextArea;
