import {groupByVaccineType, readCSV, generateRandomColorForChart, mapDataToWeeklyBasis } from '../util/functions'
import { vaxMalaysiaDataset } from "../util/links"

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

import { Line, Bar } from 'react-chartjs-2';
import Layout from '../components/layout';
export default function Number4({weeklyDataset}){
    return (
    <Layout>
        <div className={"main"}>
            <Line data={weeklyDataset}/>
        </div>
    </Layout>
    )
}

export async function getStaticProps(){
    const response = await fetch(vaxMalaysiaDataset);
    const csvText = await response.text();

    const csv = await readCSV(csvText);

    const vaccines = ['sinovac', 'sinopharm', 'cansino', 'astra', 'pfizer', 'pending'];

    const vaccineDataset = groupByVaccineType(csv, ...vaccines);
    const labels = Object.keys(vaccineDataset);

    const weeklyDataset = {
        labels,
        datasets : vaccines.map( (vaccine) =>{

            // Get the vaccine data weekly
            const vaccineWeekly = labels.map(
                label => vaccineDataset[label][vaccine]
            );
            
            return {
                label : vaccine,
                data : vaccineWeekly,
                ...generateRandomColorForChart()
            }

        })
    }
    return {
        props : {
            weeklyDataset
        }
    }
}
