import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingComponent = ({inverted}) => {
    return (
        <Dimmer inverted={inverted} active>
            <Loader content='Loading...'/>
        </Dimmer>
    );
};

export default LoadingComponent;
