import {readCSV, createDataset} from '../util/functions'
import Layout from '../components/layout'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'

import { Line} from 'react-chartjs-2';
const datasetUrl = 'https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main/registration/vaxreg_malaysia.csv'

export default function VaxReg({data}){
    return(
        <Layout>
            <Line data={data}/>
        </Layout>
    ) 
}

export async function getStaticProps(){
    const response = await fetch(datasetUrl);
    const csvText =  await response.text();
    const csv = await readCSV(csvText);

    const dates = csv.map((el) => el.date);
    const data = {
        labels : dates,
        datasets : [
            createDataset(csv, "mysj", "MySejahtra"),
            createDataset(csv, "web", "Web"),
            createDataset(csv, "call", "Call")
        ]
    }

    return {
        props: {
            data : data
        }
    }
}