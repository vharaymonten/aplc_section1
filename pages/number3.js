import {groupByVaccineType, readCSV, generateRandomColorForChart, mapDataToWeeklyBasis } from '../util/functions'
import { vaxMalaysiaDataset } from "../util/links"

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

import { Line, Bar } from 'react-chartjs-2';
import Layout from '../components/layout';
export default function Number3({weeklyDataset}){
    return (
    <Layout>
        <div className={"main"}>
            <div className={"chartCard"}>
                <Line data={weeklyDataset}/>
            </div>
        </div>
    </Layout>
    )
}

export async function getStaticProps(){
    const response = await fetch(vaxMalaysiaDataset);
    const csvText = await response.text();

    const csv = await readCSV(csvText);

    const weeklyData = mapDataToWeeklyBasis(csv);

    const labels = Object.keys(weeklyData);
    const childLow = labels.map( label => weeklyData[label].childLow);
    const childHigh = labels.map( label => weeklyData[label].childHigh);
    const adolLow = labels.map( label => weeklyData[label].adolLow);
    const adolHigh = labels.map( label => weeklyData[label].adolHigh);

    const weeklyDataset = {
        labels,
        datasets : [
            {
                label : "Adult Highest",
                data : adolHigh,
                ...generateRandomColorForChart()
            },
            {
                label : "Adult Lowest",
                data : adolLow,
                ...generateRandomColorForChart()
            },
            {
                label : "Child Highest",
                data : childHigh,
                ...generateRandomColorForChart()
            },
            {
                label : "Child Low",
                data : childLow,
                ...generateRandomColorForChart()
            }
        ]
    }
    return {
        props : {
            weeklyDataset
        }
    }
}
