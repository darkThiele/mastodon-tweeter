import React from 'react';
import axios from 'axios';
import Authorization from './Authorization';
import Toot from './Toot';
import Timeline from './Timeline';

class App extends React.Component {
    state = {instance: null, client: null, authorize_code: null, access_token: null, user_credentials: null, ws: null, toots:[]}

    componentDidMount() {
        const authorize_code = this.props.qs.code;

        if (authorize_code) {
            localStorage.setItem('authorize_code', authorize_code)
        }

        const local_instance = localStorage.getItem('instance_name');
        let local_client_data = null
        if (local_instance) {
            local_client_data = JSON.parse(localStorage.getItem('client_data'))
        }
        const local_authorize_code = localStorage.getItem('authorize_code');
        const local_access_token = localStorage.getItem('access_token')

        this.setState({instance: local_instance, client: local_client_data, authorize_code: local_authorize_code, access_token: local_access_token});
    }

    componentDidUpdate() {
        const REDIRECTURI = 'https://darkthiele.github.io/mastodon-tweeter/';
        const BASEURL = `https://${this.state.instance}`

        if (this.state.instance && this.state.client && this.state.authorize_code && !this.state.access_token) {

            const response = axios.post(`${BASEURL}/oauth/token`, {
                client_id: this.state.client.client_id,
                client_secret: this.state.client.client_secret,
                grant_type: 'authorization_code',
                code: this.state.authorize_code,
                redirect_uri: REDIRECTURI
            });

            response.then( response => localStorage.setItem('access_token', response.data.access_token));
            response.then( response => this.setState({access_token: response.data.access_token}));
        }

        if (this.state.instance && this.state.client && this.state.authorize_code && this.state.access_token && !this.state.ws) {
        
            const ws = new WebSocket(`wss://${this.state.instance}/api/v1/streaming?access_token=${this.state.access_token}&stream=public:local`);
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.state.toots.unshift(message);
                this.setState({toots: this.state.toots.slice(0, 50)});
            };
            this.setState({ws: ws});
        }
    }

    componentWillUnmount() {
        this.state.ws.close();
    }

    onInstanceSubmit = async (instance) => {
        // createOAuthApp
        const CLIENTNAME = 'mastodon-Tweeter';
        const SCOPES = 'read write follow';
        const REDIRECTURI = 'https://darkthiele.github.io/mastodon-tweeter/';
        const BASEURL = `https://${instance}`

        const response = await axios.post(`${BASEURL}/api/v1/apps`, {
                client_name: CLIENTNAME,
                redirect_uris: REDIRECTURI,
                scopes: SCOPES
        });

        localStorage.clear()

        localStorage.setItem('instance_name', instance);
        localStorage.setItem('client_data', JSON.stringify(response.data));

        this.setState({instance: instance, client: response.data})
        
        window.open(`${BASEURL}/oauth/authorize?scope=${SCOPES}&response_type=code&redirect_uri=${REDIRECTURI}&client_id=${response.data.client_id}`, '_self');

    }

    onTootSubmit = async(text) => {
        const BASEURL = `https://${this.state.instance}`;
        const ACCESSTOKEN = this.state.access_token;

        await axios.post(`${BASEURL}/api/v1/statuses`, {
            status: text,
        },
        {
            headers: {
                Authorization: `Bearer ${ACCESSTOKEN}`,
            }
        });
    }

    onTootClick = async(toot) => {
        const BASEURL = `https://${this.state.instance}`;
        const ACCESSTOKEN = this.state.access_token;
        await axios.post(`${BASEURL}/api/v1/statuses/${toot.id}/favourite`, {
        },
        {
            headers: {
                Authorization: `Bearer ${ACCESSTOKEN}`,
            }
        });
    }

    render() {
        if (!this.state.client) {
            return (
                <div className="ui container">
                    <Authorization onInstanceSubmit = {this.onInstanceSubmit}/>
                </div>
            );
        }

        return (
            <div className="ui container">
                <div className="ui segment">
                    <Authorization onInstanceSubmit = {this.onInstanceSubmit}/>
                    <Toot onTootSubmit = {this.onTootSubmit}/>
                </div>
                <div className="ui segment">
                    <Timeline toot_list = {this.state.toots} onTootClick={this.onTootClick}/>
                </div>
            </div>
        );
    }
}

export default App;