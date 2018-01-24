import {EventListener, EventListenerPoll} from "../eventlistener"
import React from "react"
import ReactDOM from "react-dom"
import {Hinoc3DChart} from "./3dcharts"
import {HinocSerializerSet} from "./dataserialization"

function appendArrayToSelector(selector, data) {
    if(!selector || !data instanceof Array) {
        return false;
    }
    selector.innerHTML = "";
    for(let item in data) {
        let child = document.createElement("option");
        child.innerText = data[item];
        selector.appendChild(child);
    }
}

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
                    <button type="button" className="close" aria-label="Close" onClick={()=>{this.moduleClose()}}>
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
                type: "time",
                splitLine: {
                    show: false
                }
            },
            yAxis:{},
            series: {
                name: 'value',
                type: this.props.charttype,
                areaStyle:{normal:{}},
                data:[]
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }]
        };
        this.showChart();
        this._showConfigButton.addEventListener("click", ()=>{this.props.showConfigTrigger();}, false);
    }

    componentDidUpdate() {
        //console.log(this.props);
        let data = HinocSerializerSet.serialize(this.props.chartName, this.props.chartValue);
        //this.props.chartValue.map( x => { [first, ...paras] = x; return {name: x[0].split(".")[0].replace("T", " "),value:[x[0].split(".")[0].replace("T", " "), ...paras] }} );
        
        console.log(data);
        this._chart.setOption({
            series:[{data: data}],
            title:{
                text: this.props.chartName
            }
        });
    }

    showChart() {
        this._chart.setOption(this._chartoption);
    }

    moduleClose() {
        //console.log("Clicked! - 1");
        if(this.props.moduleClose) {
            //console.log("Clicked! - 2");
            this.props.moduleClose();
        }
    }
}

class QueryModalReact extends React.Component{
    constructor(...args) {
        super(...args);
        this.state = {
            realtimeMode : "history"
        };
        this._eventListener = EventListenerPoll.get(this.props.keyid);
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
                        <span className="input-group-addon"><a ref="queryButton"><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>Query</span>
                        <select className="form-control" ref="itemGroupSelector">Select....</select>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon"><a ref="itemButton"><span className="glyphicon glyphicon-refresh"></span></a>Item</span>
                        <select className="form-control" ref="itemSelector">Select....</select>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon"><a ref="deviceButton"><span className="glyphicon glyphicon-refresh"></span></a>Device Mac Addr</span>
                        <select className="form-control" ref="deviceSelector">Select....</select>
                    </div>
                    <div className="input-group date" ref="startTimeSelector">
                        <span className="input-group-btn add-on"><button type="button" className="btn btn-default">Start <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span></button></span>
                        <input type="text" className="form-control" data-format="yyyy-MM-dd HH:mm:ss" type="text"></input>
                    </div>
                    <div className="input-group date" ref="endTimeSelector">
                        <span className="input-group-btn add-on"><button type="button" className="btn btn-default"> End  <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span></button></span>
                        <input type="text" className="form-control" data-format="yyyy-MM-dd HH:mm:ss" type="text"></input>
                    </div>
                    <button className="btn btn-primary" type="button" ref="realtimebtn" onClick={()=>{this.switchRealTimeMode()}}>{this.state.realtimeMode}</button>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={()=>{this.submitQuery();}}>Submit</button>
                </div>
            </div>
        </div>);
    }

    componentDidMount() {
        $(this.refs.startTimeSelector).datetimepicker({
            language: 'en'
        });
        $(this.refs.endTimeSelector).datetimepicker({
            language: 'en'
        });
        $(this.refs.queryButton).on("click", ()=>{
            $.get("itemgroup", (data)=>{
                appendArrayToSelector(this.refs.itemGroupSelector, data);
            });
        });
        $(this.refs.itemButton).on("click", ()=>{
            $.get("oamitem", {group: this.refs.itemGroupSelector.options[this.refs.itemGroupSelector.selectedIndex].innerText}, (data)=>{
                appendArrayToSelector(this.refs.itemSelector, data);
            });
        });
        $(this.refs.deviceButton).on("click", ()=>{
            $.get("devices", {
                group: this.refs.itemGroupSelector.options[this.refs.itemGroupSelector.selectedIndex].innerText                
            }, (data)=>{
                appendArrayToSelector(this.refs.deviceSelector, data);
            });
        });
        this._eventListener.trigger("changeRealtimeStatus", this.state.realtimeMode);
    }

    componentDidUpdate() {
        if(this.props.showConfig === true) {
            $(this._modal).modal("show");
            this.props.clearShowFlag();
        }
    }

    submitQuery() {
        $(this._modal).modal("hide");
        let startTimeTextLabel = this.refs.startTimeSelector.getElementsByClassName("form-control")[0];
        let endTimeTextLabel = this.refs.endTimeSelector.getElementsByClassName("form-control")[0];
        let startTime = startTimeTextLabel.value;
        let endTime = endTimeTextLabel.value;
        let group = this.refs.itemGroupSelector.options[this.refs.itemGroupSelector.selectedIndex].innerText;
        let item = this.refs.itemSelector.options[this.refs.itemSelector.selectedIndex].innerText;
        let addr = this.refs.deviceSelector.options[this.refs.deviceSelector.selectedIndex].innerText;

        if(group === "eocDevChanInfo" && this.props.charttype === "3d") {
            let itemstr = item.split('-')[0];
            item = `/${itemstr}-[0-9]{1,}/`
        } else {
            item = `"${item}"`;
        }

        let queryConfig = {
            group: group,
            item: item,
            starttime: startTime,
            endtime: endTime,
            realtime: this.state.realtimeMode === "realtime",
            addr: addr
        };
        //console.log(queryString, startTime, endTime);
        this.props.updateQuery(queryConfig);
        this._eventListener.trigger("changeRealtimeStatus", this.state.realtimeMode);
    }

    checkQuerySafe(query) {
        //TODO: complex checking the query statement's illegal
        return true;
    }

    switchRealTimeMode() {
        if(this.state.realtimeMode == "realtime") {
            this.setState({realtimeMode: "history"});
        }
        else if(this.state.realtimeMode == "history") {
            this.setState({realtimeMode: "realtime"});
        }
        else {
            this.setState({realtimeMode: "history"});
        }

        this._eventListener.trigger("changeRealtimeStatus", this.state.realtimeMode);
    }
}

class HinocChartModuleReact extends React.Component{
    constructor(...args) {
        super(...args);
        this.state = {
            showConfig: false,
            chartValue: [],
            chartName: "new hinoc chart",
            mouduleClose: false
        };
        this._influxdbquery = "";
        this._chartValue = null;
        this._eventListener = EventListenerPoll.create(this.props.keyid);
        this._queryConfig = {
            group: "",
            item: "",
            realtime: false,
            starttime: "",
            endtime: "",
            addr: ""
        };
    }

    render() {
        return (this.state.mouduleClose ? (null) : (this.props.charttype === "3d" ? (
            <div className="hinoc-chart-container">
            <Hinoc3DChart charttype={this.props.charttype} showConfigTrigger={()=>{this.showConfig();}} 
            chartValue={this.state.chartValue} chartName={this.state.chartName} moduleClose={()=>{ this.setState({mouduleClose:true}); }}/>
            <QueryModalReact showConfig={this.state.showConfig} clearShowFlag={()=>{this.clearFlag();}} 
            updateQuery={(query)=>{this.updateQuery(query);}}
            keyid={this.props.keyid} charttype={this.props.charttype} />
        </div>
        ) : (
        <div className="hinoc-chart-container">
            <HinocChartReact charttype={this.props.charttype} showConfigTrigger={()=>{this.showConfig();}} 
            chartValue={this.state.chartValue} chartName={this.state.chartName} moduleClose={()=>{ this.setState({mouduleClose:true}); }}/>
            <QueryModalReact showConfig={this.state.showConfig} clearShowFlag={()=>{this.clearFlag();}} 
            updateQuery={(query)=>{this.updateQuery(query);}}
            keyid={this.props.keyid} charttype={this.props.charttype}/>
        </div>)
        )
        );
    }

    componentDidMount() {
        let self = this;
        this._eventListener.on("changeRealtimeStatus", (mode)=>{
            if(mode === "history") {
                if(this.queryTimer !== undefined) {
                    clearInterval(this.queryTimer);
                }
                //console.log(`history, query is ${self._influxdbquery}`);
                $.get("/testdb", {
                    group: this._queryConfig.group,
                    items: this._queryConfig.item,
                    realtime: this._queryConfig.realtime,
                    starttime: this._queryConfig.starttime,
                    endtime: this._queryConfig.endtime,
                    addr: this._queryConfig.addr
                }, (data)=>{this.updateData(data);});
            }
            else {
                if(this.queryTimer === undefined) {
                    this.queryTimer = setInterval(function(){
                        if(self._influxdbquery === undefined || self._influxdbquery === "" || self._influxdbquery.length === 0)
                            return;
                        $.get("/testdb", {
                            group: this._queryConfig.group,
                            items: this._queryConfig.item,
                            realtime: this._queryConfig.realtime,
                            starttime: this._queryConfig.starttime,
                            endtime: this._queryConfig.endtime,
                            addr: this._queryConfig.addr
                        }, (data)=>{self.updateData(data);});
                    }, 
                    5000);
                }
            }
        });
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

    preprocessQuery(query, start, end, mode) {
        if(mode === "history") {
            let stringrule = /^\s*SELECT \"([^\"]*)\" FROM \"([^\"]*)\"(?:\s*WHERE)?\s*([\s\w><=!]*)/;
            let result = stringrule.exec(query);
            //console.log(result);
            let field = result[1];
            let item = result[2];
            let choose = result[3];
            //let choose = (result[3] === null || result[3].length === 0) ? result[3] + " AND": " ";
            if(result[3] === null || result[3].length === 0) {
                return `SELECT "${field}" FROM "${item}" WHERE time > '${start}' AND time < '${end}'`;
            }
            else {
                return `SELECT "${field}" FROM "${item}" WHERE (${choose}) AND time > '${start}' AND time < '${end}'`;
            }
        }
        else {
            return `${query} ORDER BY time DESC LIMIT 300`;
        }
    }

    updateQuery(querydata) {
        //todo: parse sql statement and insert time stamp to somewhere right
        //this._influxdbquery = this.preprocessQuery(query, start, end, mode);
        this._queryConfig = querydata;
    }

    getQuery(query) {
        return this._influxdbquery;
    }

    updateData(data) {
        if(data.series === undefined) {
            return;
        }
        this.setState({
            showConfig: this.state.showConfig,
            chartValue: data.series[0].values,
            chartName: data.series[0].name
        });
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
        arr.push(<HinocChartModuleReact key={hinocChartCounter} charttype="line" keyid={`${hinocChartCounter}`}/>);
        hinocChartCounter ++;
        ReactDOM.render(
            arr,
            chartContainer,
        );
    };

    document.getElementById("add-bar-btn").onclick = function() {
        arr.push(<HinocChartModuleReact key={hinocChartCounter} charttype="bar" keyid={`${hinocChartCounter}`}/>);
        hinocChartCounter ++;
        ReactDOM.render(
            arr,
            chartContainer
        );
    };

    document.getElementById("add-pan-btn").onclick = function() {
        arr.push(<HinocChartModuleReact key={hinocChartCounter} charttype="pie" keyid={`${hinocChartCounter}`}/>);
        hinocChartCounter ++;
        ReactDOM.render(
            arr,
            chartContainer
        );
    };

    document.getElementById("add-3d-btn").onclick = function() {
        arr.push(<HinocChartModuleReact key={hinocChartCounter} charttype="3d" keyid={`${hinocChartCounter}`}/>);
        hinocChartCounter ++;
        ReactDOM.render(
            arr,
            chartContainer
        );
    }
});