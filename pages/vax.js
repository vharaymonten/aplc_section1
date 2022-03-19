import {readCSV, filterByState, filterByMonth, groupByState, } from '../util/functions';
import Layout from '../components/layout';
import {useState, useEffect} from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

// import { Chart as ChartJS } from 'chart.js/auto';

// import { Chart } from 'react-chartjs-2'
import { Line, Bar } from 'react-chartjs-2';


export default function Vax ({data, histogram}){
    const [month, setMonth ] = useState(0);
    const [dataset, setDataset]  = useState(null);
    useEffect(()=>{
        const fetchDataset =  async () => await getDataset(month);
        fetchDataset().then(
            (result) => {
                setDataset(result);
            }
        )

        
    }, [month])
    return (
    <>
    <Layout>
    <h1>Hello {data.name}</h1> 
        <select className={"selectionInput"} name="month" onChange={ (e) => setMonth(e.target.value)}>
            <option value="0" >January</option>
            <option value="1">Febuary</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
        </select>
    {dataset != null ? 
        <div className={"chartCard"}>
            <Line data={dataset} />
        </div>  : <></>
    }

    <div className={"chartCard"}>
        <Bar data={histogram}/>
    </div>
    


    </Layout>
    </>
    )

}   
export async function getStaticProps(){
    const res = await fetch('http://localhost:3000/api/names/Jivha Raymond/');
    const data = await res.json();

    const csvState = await fetch('http://localhost:3000/csv/vax_state.csv')
    const csvStateText = await csvState.text();
    const results = await readCSV(csvStateText);
    const {states, dataY} = groupByState(results);
    const histogram  = {
        labels : states,
        datasets : [{
            label : "#Number of vaccine taken",
            data : dataY
        }]

    }

    return {
        props : {
            data,
            histogram
        },
    }
}
async function getVaccinationWeekly(vaccinetype){
    const csvRaw = await fetch('http://localhost:3000/csv/vax_malaysia.csv')
    const csvText = await csvRaw.text();
    const csv = await readCSV(csvText);
    map

}
async function getDataset(month){
    const csvRaw = await fetch('http://localhost:3000/csv/vax_malaysia.csv')
    const csvText = await csvRaw.text();

    const csv = await readCSV(csvText);
    const byMonth = await filterByMonth(csv, month);
    const labelX = byMonth.map( (el) => el.date);

    
    const dataset = [
        {
            label : "Daily Partial",
            fill : false,
            backgroundColor:'rgba(255,255,72, 0.4)',
            borderColor : 'rgba(255, 255,72, 1)',
            data : byMonth.map( el => el['daily_partial'])
        },
        {
            label : "Daily Full",
            fill : false,
            backgroundColor:'rgba(72,255,255, 0.4)',
            borderColor : 'rgba(72, 255,255, 1)',
            data : byMonth.map( el => el['daily_full'])
        },
        {
            label : "Daily Booster",
            fill : false,
            backgroundColor:'rgba(255,72,255, 0.4)',
            borderColor : 'rgba(255, 72,255, 1)',
            data : byMonth.map( el => el['daily_booster'])
        }

    ]

    const chartData = {
        labels : labelX,
        datasets : dataset
    }
    return chartData;
}