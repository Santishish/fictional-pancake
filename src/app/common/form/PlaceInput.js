import React, {Component} from 'react';
import {Form, Label} from 'semantic-ui-react';
import PlacesAutocomplete from 'react-places-autocomplete';

const styles = {
    autocompleteContainer: {
        zIndex: 1000
    }
};

class PlaceInput extends Component {

    render() {

        const {input, width, onSelect, placeholder, options, meta: {touched, error}} = this.props;
        return (
            <Form.Field error={touched && !!error} width={width}>
                <PlacesAutocomplete inputProps={{...input, placeholder}} options={options} onSelect={onSelect}
                                    styles={styles}/>
                {touched && error && <Label basic color='red'>{error}</Label>}
            </Form.Field>
        );
    }
}

export default PlaceInput;