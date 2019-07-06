import React from 'react';
import {MobileView} from 'react-device-detect';

class Toot extends React.Component {
    state = {text: ''};

    onFormSubmit = event => {
        // TODO: Give a input to the parent component
        this.props.onTootSubmit(this.state.text);
        this.setState({text: ''})
    }

    keyDownSubmit = event => {
        if(event.ctrlKey && event.keyCode === 13) {
            this.onFormSubmit();
        }
    }

    buttonPressSubmit = event => {
        event.preventDefault();
        this.onFormSubmit();
    }

    render() {
        console.log(this.state.text);
        return(
            <div className="toot ui form">
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>User Toot</label>
                        <textarea 
                            value={this.state.text}
                            onChange={(e) => this.setState({text: e.target.value})}
                            onKeyDown={this.keyDownSubmit}
                        />
                    </div>
                    <MobileView >
                        <button class="fluid ui button" onClick={this.buttonPressSubmit}>Submit</button>
                    </MobileView>
                </form>
            </div>
        );
    }
}

export default Toot;