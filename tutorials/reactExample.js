/*jslint browser: true, es6: true*/
class CanvasDatagrid extends React.Component {
    constructor(props) {
        super(props);
    }
    updateAttributes(nextProps) {
        Object.keys(this.props).forEach(key => {
            if (!nextProps || this.props[key] !== nextProps[key]) {
                if (this.grid.attributes[key] !== undefined) {
                    this.grid.attributes[key] = nextProps ? nextProps[key] : this.props[key];
                } else {
                    this.grid[key] = nextProps ? nextProps[key] : this.props[key];
                }
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        this.updateAttributes(nextProps);
    }
    shouldComponentUpdate() {
        return false;
    }
    componentWillUnmount() {
        this.grid.dispose();
    }
    componentDidMount() {
        var args = {};
        this.grid = ReactDOM.findDOMNode(this);
        this.updateAttributes();
    }
    render() {
        return React.createElement('canvas-datagrid', {});
    }
}
function getRandomData() {
    return [{
        foo: Math.random(),
        bar: Math.random(),
        baz: Math.random()
    }];
}
var grid = React.createElement(CanvasDatagrid, {
        style: {
            backgroundColor: 'tan'
        },
        data: getRandomData(),
        oncellmouseover: function (e) {
            e.cell.value = Math.random()
        }
    });
ReactDOM.render(grid, document.getElementById('root'));
