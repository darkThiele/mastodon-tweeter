import './TootDetail.css'
import React from 'react';

class TootDetail extends React.Component {

    onTootClick = (event) => {
        this.props.onTootClick(this.props.toot);
    }

    render() {
        if (!this.props.toot.account) {
            return (
                <div className="toot-detail item">
                    トゥートが削除されています
                </div>
            );
        }

        return (
                <div className={`toot-detail item`} onClick={this.onTootClick}>
                    <img alt="icon" className="ui avatar image" src={this.props.toot.account.avatar} />
                    <div className="content">
                        <div className="header">{this.props.toot.account.display_name} @{this.props.toot.account.acct}</div>
                        <div className="description">{this.props.toot.content.replace(/<\/?[^>]+>/gi, '')}</div>
                    </div>
                </div>
        );
    }
}

export default TootDetail;