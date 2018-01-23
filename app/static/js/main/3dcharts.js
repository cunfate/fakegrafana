import {EventListener, EventListenerPoll} from "../eventlistener"
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
            visualMap: {
            show: false,
            dimension: 2,
            min: 0,
            max: 23,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }},
            xAxis3D: {
                type: 'time',
                data: []
            },
            yAxis3D: {
                type: 'category',
                data:  Array.from(new Array(1024),(val,index)=>index),
            },
            zAxis3D: {
            type: 'value',
            max: 25,
            splitNumber: 5},
            grid3D: {
            viewControl: {
                // projection: 'orthographic'
            },
            boxHeight: 40,
            boxWidth: 200,},
            series: [{
            type: 'surface',
            wireframe: {
                show: false
            },
            shading: 'color',
            equation: {
                z: function(x,y) {
                    return x + y;
                }
            }
            }]
          };
        this.showChart();
        this._showConfigButton.addEventListener("click", ()=>{this.props.showConfigTrigger();}, false);
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