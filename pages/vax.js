import { readCSV, createDataset, filterByMonth, generateRandomColorForChart} from '../util/functions';
import Layout from '../components/layout';
import { useState, useEffect } from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import {vaxMalaysiaDataset} from '../util/links'
import { Line} from 'react-chartjs-2';


export default function Vax({ data, histogram }) {
    const [month, setMonth] = useState(1);
    const [dataset, setDataset] = useState(null);
    useEffect(() => {
        const fetchDataset = async () => await getDataset(month);
        fetchDataset().then(
            (result) => {
                setDataset(result);
            }
        )


    }, [month])
    return (
        <>
            <Layout>
                <div className={"main"}>
                    <div className={"contentWrapper"}>

                        <select  className={"selectionInput gap-1"} name="month" onChange={(e) => setMonth(e.target.value)}>
                            <option value="1">Febuary 2021</option>
                            <option value="2">March 2021</option>
                            <option value="3">April 2021</option>
                            <option value="4">May 2021</option>
                            <option value="5">June 2021</option>
                            <option value="6">July 2021</option>
                            <option value="7">August 2021</option>
                            <option value="8">September 2021</option>
                            <option value="9">October 2021</option>
                            <option value="10">November 2021</option>
                            <option value="11">December 2021</option>
                            <option value="0" >January 2022</option>
                            <option value="-1">2021-2022</option>
                        </select>

                        {dataset != null ?
                            <div className={"chartCard"}>
                                <Line data={dataset} redraw={true}/>
                            </div> : <></>
                        }
                    </div>
                </div>
            </Layout>
        </>
    )
}
async function getDataset(month) {
    const csvRaw = await fetch(vaxMalaysiaDataset);
    const csvText = await csvRaw.text();

    const csv = await readCSV(csvText);
    const byMonth = await filterByMonth(csv, month);
    const labelX = byMonth.map((el) => el.date);

    const partialColors = generateRandomColorForChart();
    const boosterColors = generateRandomColorForChart();
    const dailyBooster = generateRandomColorForChart();
    const dataset = [
        {
            ...createDataset(byMonth, 'daily_partial', 'Daily Partial'),
            ...partialColors 
        },
        {
            ...createDataset(byMonth, 'daily_full', 'Daily Partial'),
            ...boosterColors,
        },
        {
            ...createDataset(byMonth, 'daily_booster', 'Daily Booster'),
            ...dailyBooster
        },
    ]

    const chartData = {
        labels: labelX,
        datasets: dataset,
    }

    return chartData;
}