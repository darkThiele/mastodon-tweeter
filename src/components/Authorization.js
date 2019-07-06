import React from 'react';

class Authorization extends React.Component {
    state = {instance: localStorage.getItem('instance_name')}

    onFormSubmit = event => {
        event.preventDefault();
        // TODO: Give a input to the parent component
        this.props.onInstanceSubmit(this.state.instance);
    }

    render() {
        return (
            <div className="authorization ui form">
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>User Instance</label>
                        <input 
                            type="text"
                            value={this.state.instance}
                            onChange={(e) => this.setState({instance: e.target.value})}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default Authorization