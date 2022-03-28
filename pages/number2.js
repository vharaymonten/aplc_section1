import {vaxMalaysiaDataset, vaxStateMalaysiaDataset} from '../util/links'
import  {groupByState, groupByMonth, readCSV, generateRandomColorForChart} from '../util/functions'
import Layout from '../components/layout';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

import { Line, Bar } from 'react-chartjs-2';
export default function Number2({stateData, monthlyData}){
    return (
        
        <>
        <Layout>
            <div className={"main"}>
                <div className={"chartCard"}>

                    <Bar data={stateData}/>

                </div>
                <div className={"chartCard"}>
                    <Bar data={monthlyData} />
                </div>
            </div>
        </Layout>
        </>
    )
}

export async function getStaticProps(){
    const response = await fetch(vaxMalaysiaDataset);
    const csvRaw = await response.text();
    const csv = await readCSV(csvRaw);

    const responseState = await fetch(vaxStateMalaysiaDataset);
    const csvStateRaw = await responseState.text();
    const csvState = await readCSV(csvStateRaw);


    // Group data by month and state
    const monthlyDataRaw = groupByMonth(csv);
    const stateDataRaw = groupByState(csvState);

    //Transform data into Chart JS 2 format
    
    //Create backgroun color for background color and border color
    const colors = monthlyDataRaw.labels.map( (_) => generateRandomColorForChart())
    
    // Colors for state dataset
    const colorsState = stateDataRaw.labels.map( (_) => generateRandomColorForChart())
    const stateData = {
        labels : stateDataRaw.labels,
        datasets : [
            {
                label : 'State vaccination',
                data : stateDataRaw.data,
                backgroundColor : colorsState.map( color => color.backgroundColor),
                borderColor : colorsState.map(color => color.borderColor)

            }
        ]
    }

    const monthlyData = {
        labels : monthlyDataRaw.labels,
        datasets : [
            {
                label : 'Monthly vaccination',
                data : monthlyDataRaw.data,
                backgroundColor : colors.map( color => color.backgroundColor),
                borderColor : colors.map(color => color.borderColor)

            }
        ]
    }
    return {
        props : {
            monthlyData,
            stateData
        }
    }

}