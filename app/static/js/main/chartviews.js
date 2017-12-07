//import EventListener from "../eventlistener"

class HinocChartReact extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            startTime: null,
            endTime: null
        }
    }

    render() {
        let self = this;
        return (
            <div className="col-md-12 panel panel-default" style={{height:460}}>
                <div className="col-md-12 panel-heading panel-primary" ref={function(ele){self._echartBar = ele;}}>
                    <button type="button" className="btn btn-default" ref={function(ele){self._showConfigButton = ele;}}>
                        <span className="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
                    </button>
                    <button type="button" className="close" aria-label="Close">
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                </div>
                <div className="col-md-12" ref={function(ele){self._echartContainer = ele;}} style={{height:400}}>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._chart = echarts.init(this._echartContainer);
        this._chartoption = {
            title: {
                text: 'New Hinoc chart'
            },
            tooltip:{},
            backgroundColor: 'rgba(153, 255, 204, 0.3)',
            legend: {
                data:'show'
            },
            xAxis:{
                data:[]
            },
            yAxis:{},
            series: {
                name: 'value',
                type: this.props.charttype,
                areaStyle:{normal:{}},
                data:[]
            }
        };
        this.showChart();
        this._showConfigButton.addEventListener("click", ()=>{this.props.showConfigTrigger();}, false);
    }

    showChart() {
        this._chart.setOption(this._chartoption);
    }
}

class QueryModalReact extends React.Component{
    constructor(...args) {
        super(...args);
    }

    render() {
        let self = this;
        return (
        <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true" ref={function(ele){self._modal = ele;}}>
            <div className="modal-dialog">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4>Set Statements</h4>
                </div>
                <div className="modal-body">
                    <div className="input-group">
                        <span className="input-group-addon">Query</span>
                        <input type="text" className="form-control" place-holder="SELECT * FROM /.*/" ref={(ele)=>{this._queryString = ele;}} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={()=>{this.submitQuery();}}>Submit</button>
                </div>
            </div>
        </div>);
    }
    componentDidUpdate() {
        if(this.props.showConfig === true) {
            $(this._modal).modal("show");
            this.props.clearShowFlag();
        }
    }

    submitQuery() {
        $(this._modal).modal("hide");
        let queryString = this._queryString.value;
        if(!this.checkQuerySafe(queryString)) {
            return false;
        }
        this.props.updateQuery(queryString);
    }

    checkQuerySafe(query) {
        //TODO: complex checking the query statement's illegal
        return true;
    }

    componentDidMount() {
        let self = this;
        if(this.queryTimer === undefined) {
            this.queryTimer = setInterval(function(){
                $.get("/mydb", {}, function(data){
                    console.log(data);
                });
            }, 5000);
        }
    }
}

class HinocChartModuleReact extends React.Component{
    constructor(...args) {
        super(...args);
        this.state = {
            showConfig: false
        };
        this._influxdbquery = "";
    }

    render() {
        return(
        <div className="hinoc-chart-container">
            <HinocChartReact charttype={this.props.charttype} showConfigTrigger={()=>{this.showConfig();}}/>
            <QueryModalReact showConfig={this.state.showConfig} clearShowFlag={()=>{this.clearFlag();}} 
            updateQuery={(query)=>{this.updateQuery(query);}}/>
        </div>);
    }

    showConfig() {
        this.setState({
            showConfig: true
        });
    }

    clearFlag() {
        this.setState({
            showConfig: false
        });
    }

    updateQuery(query) {
        this._influxdbquery = query;
        console.log(this._influxdbquery);
    }


}

$(document).ready(function(){
    alert("setup over");

    document.getElementById("add-row").onclick = function() {
        document.getElementById("row-adder-bar").style.display="block";
        document.getElementById("add-row").style.display="none";
    };

    document.getElementById("row-adder-bar").onclick = function() {
        document.getElementById("row-adder-bar").style.display="none";
        document.getElementById("add-row").style.display="block";
    };

    var hinocChartCounter = 1;
    var arr = [];
    let chartContainer = document.getElementById("charts-container");
    document.getElementById("add-liner-btn").onclick = function() {
        arr.push(<HinocChartModuleReact key={hinocChartCounter} charttype="line" />);
        hinocChartCounter ++;
        ReactDOM.render(
            arr,
            chartContainer,
        );
    };

    document.getElementById("add-bar-btn").onclick = function() {

    };

    document.getElementById("add-pan-btn").onclick = function() {
    };
});