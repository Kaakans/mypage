import { h, Component } from 'preact';

export default class Contact extends Component<any, any> {
    render() {
        return <div id="contact">
            <h1 className="secondary-title">Kontakt</h1>
            <table>
                <thead>
                    <tr>
                        <th width="40"></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderFacebook()}
                    {this.renderTelephone()}
                    {this.renderAdress()}
                </tbody>
            </table>
        </div>
    }

    private renderFacebook = () => {
        return <tr>
            <td><i className="fa fa-github" /></td>
            <td><a href="https://github.com/kaakans">Jonathan Boellke@github.com</a></td>
        </tr>;
    }

    private renderTelephone = () => {
        return <tr>
            <td><i className="fa fa-phone" /></td>
            <td>070 555 72 72</td>
        </tr>;
    }

    private renderAdress = () => {
        return <tr>
            <td><i className="fa fa-map-marker" /></td>
            <td>Address @ Sweden</td>
        </tr>;
    }
}