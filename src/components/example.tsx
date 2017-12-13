import { h, Component } from 'preact';

export default class Example extends Component<any, any> {
    render() {
        return <div className="example">
            <div className="box">
                <img />
                <div className="info">
                    <div className="title">Example</div>
                    <a href="example.com">example.com</a>
                    <div className="text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Phasellus enim leo, lobortis quis pretium in, viverra ut nibh. 
                        Cras sollicitudin arcu dignissim dui dapibus, vel dapibus arcu mattis. 
                        Nunc dapibus lacinia purus, non scelerisque odio congue ac. Etiam cursus tempus fringilla. 
                        Maecenas et purus nibh. Duis orci augue, ullamcorper sed nulla ac, ultricies tincidunt massa. 
                        Praesent erat nibh, euismod et vehicula non, eleifend at elit. 
                    </div>
                </div>
            </div>
        </div>
    }
}