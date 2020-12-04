import React, { Component } from 'react'
import { Pie } from 'react-chartjs-2';

export default class ProgressChart extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        console.log(this.props);
     return ( 
            <div className="chart">
                <div className="progress-chart-container"> 
                    <Pie
                        data={{
                            labels: ['Set Completed', 'Set Remaining'],
                            datasets:[
                                {
                                    data: [
                                        this.props.todo,
                                        this.props.completed
                                    ],
                                    backgroundColor: [
                                        '#FDBF00',
                                        '#FA4570',
                                    ]
                                }
                            ]
                          }}
                        options={{
                            legend:{
                            display:false,
                            position:'right'
                            }
                        }}

                    />
                </div>
            </div>
        )
    }
}