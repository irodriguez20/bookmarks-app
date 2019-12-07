import React from 'react';
import ReactDOM from 'react-dom';
import UpdateBookmark from './UpdateBookmark';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const props = {
        match: { params: {} },
        history: {
            push: () => { }
        },
    }
    ReactDOM.render(<UpdateBookmark {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
});