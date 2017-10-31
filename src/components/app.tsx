import { h, Component } from 'preact';
import Header from './header';
import Content from './content';
import Examples from './examples';
import Reviews from './reviews';
import Footer from './footer';
import { View } from './enums/view';

export interface IComponentState {
    currentView: View;
}

export default class App extends Component<any, IComponentState> {

    private renderCallback = (view: View) => {
        this.setState({ currentView: view });
    }

    private renderStart = () => {
        return <Content />;
    }

    private renderExamples = () => {
        return <Examples />;
    }

    private renderReviews = () => {
        return <Reviews />;
    }

    private renderContent = () => {
        var html = this.renderStart();

        if (this.state.currentView === View.Examples)
        return this.renderExamples();
            
        if (this.state.currentView === View.Reviews)
            return this.renderReviews();

        return <div className="content-container">{html}</div>;
    }

    render() {
        return <div>
            <Header renderCallback={this.renderCallback} />
            {this.renderContent()}
            <Footer />
        </div>;
    }
}