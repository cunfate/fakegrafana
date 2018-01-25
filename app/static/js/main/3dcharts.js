import {EventListener, EventListenerPoll} from "../eventlistener"
import {HinocSerializerSet} from "./dataserialization"
import React from "react"
import ReactDOM from "react-dom"


//import {  } from "echarts/lib/component/surface";

class Hinoc3DChart extends React.Component {
    constructor(...args) {
        super(...args);
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
            tooltip: {},
            backgroundColor: '#fff',
            xAxis3D: {
                type: 'time'
            },
            yAxis3D: {
                type: 'value',
            },
            zAxis3D: {
                type: 'value',
            },
            grid3D: {
                viewControl: {
                    // projection: 'orthographic'
                },
                boxHeight: 40
            },
            series: [{
                type: 'surface',
                wireframe: {
                    show: true
                },
                shading: 'color',
                data:[[new Date("2017-11-16T08:46:33"), 1, 666666], [new Date("2017-11-16T08:46:33"), 2, 2]]
            }],
        };
        this.showChart();
        this._showConfigButton.addEventListener("click", ()=>{this.props.showConfigTrigger();}, false);
    }

    componentDidUpdate() {
        let data = HinocSerializerSet.serialize(this.props.chartName, this.props.chartValue, '3d');
        //this.props.chartValue.map( x => { [first, ...paras] = x; return {name: x[0].split(".")[0].replace("T", " "),value:[x[0].split(".")[0].replace("T", " "), ...paras] }} );
        
        console.log(data);
        this._chart.setOption({
            series:[{data: data}]
        });
    }

    showChart() {
        this._chart.setOption(this._chartoption);
    }

    moduleClose() {
        if(this.props.moduleClose) {
            this.props.moduleClose();
        }
    }
}

export {Hinoc3DChart};