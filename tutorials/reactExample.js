/*jslint browser: true, es6: true*/
class CanvasDatagrid extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps() {
        Object.keys(this.props).forEach(key => {
            if (grid.attributes[key] !== undefined) {
                this.grid.attributes[key] = this.props[key];
            } else if (this.grid[key]) {
                this.grid[key] = this.props[key];
            }
        });
    }
    componentWillUnmount() {
        this.grid.dispose();
    }
    componentDidMount() {
        var args = {};
        Object.keys(this.props).forEach(key => args[key] = this.props[key]);
        args.parentNode = ReactDOM.findDOMNode(this);
        this.grid = canvasDatagrid(args);
    }
    render() {
        return React.createElement('div', {});
    }
}