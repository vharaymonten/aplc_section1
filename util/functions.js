// const { doesNotThrow } = require('assert');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const vaccineTypes = ["phizer", "sinovac", "astra", "sinopharm", "cansino", "pending"]

const DateTime = require('luxon');
import dynamic from 'next/dynamic';
import papaparse from 'papaparse';
function readCSV(csvString){
    return new Promise((resolve) => {
        const parseResult = papaparse.parse(csvString, {
            header : true,
        });

        const data = parseResult.data;
        data.pop();
        resolve(data);
    })
}


export function groupByMonth(results){

    // Representing 12 Months
    const dataTemp = new Object();

    results.forEach(
        (vax) => {
            const dateTime = DateTime.DateTime.fromISO(vax.date);
            const yearmonth = `${dateTime.year}-${monthNames[dateTime.month-1]}`
            const daily = Number.parseInt(vax.daily);

            if (dataTemp.hasOwnProperty(yearmonth)){
                dataTemp[yearmonth] += daily;
            }else{
                dataTemp[yearmonth] = daily;
            }
            
        }   
    )

    const labels = Object.keys(dataTemp);
    const data = labels.map( label=> dataTemp[label]);
    return {
        data,
        labels
    }
}
export  default function groupByState(results){
    // This function is pure as it does not depend on other variable outside of this local function scope 
    const states = new Object();
    
    // Fetch the state first
    results.forEach(el =>{
        
        // Create a property in JS objec if does not exist. 
        if (! states.hasOwnProperty(el.state)){
            states[el.state] = Number.parseInt(el.daily);
        }else{
        // Add the cumulative to the existing states
            states[el.state] += Number.parseInt(el.daily);
        }

    })
    
    // Create labels for histogram
    const labelX = Object.keys(states);
    //create Dataset for Y axis
    const dataY = labelX.map( state => states[state]);
    return {
        labels : labelX,
        data : dataY
    }

}

export async function filterByMonth(results,month){
    // If all months
    if (month == -1){
        return [...results];
    }
    const r = results.filter( (el) => {
        if (new Date(el.date).getMonth() == month){
            return el;
        }
    })
    return r;
}

export async function filterByState(results, state){
    const filteredResults = results.filter( (el) => {
        if (el.state == state) return el;
    }) 
    return filteredResults;
}

function mapDataToWeeklyBasis(csv){
    const weeklyBasisData = {};
    csv.forEach( row => {
        const dt = DateTime.DateTime.fromJSDate(new Date(row.date));
        const key = `week ${dt.weekNumber} of ${dt.year}`

        
        if (row.daily_full_adol == undefined) return;
        
        //Ignore booster as there is no specific data for booster for adol or child

        const adol =Number.parseInt(row.daily_full_adol) +
                    Number.parseInt(row.daily_partial_adol) 
                    // Number.parseInt(row.daily_booster_adol);

        const child =Number.parseInt(row.daily_full_child) + 
                     Number.parseInt(row.daily_partial_child) 
                    
                    
                    //  Number.parseInt(row.daily_booster_child)

        // console.log(adol);
        if (!weeklyBasisData.hasOwnProperty(key)){
            weeklyBasisData[key] = {
                adolHigh : adol,
                adolLow : adol,
                childHigh : child,
                childLow : child
            }
        }else{
            const weekly = weeklyBasisData[key];
            // Get the lowest and highest for adol and child
            weekly.adolHigh = weekly.adolHigh < adol ? adol : weekly.adolHigh;
            weekly.adolLow = weekly.adolLow > adol ? adol : weekly.adolLow;
            weekly.childHigh = weekly.childHigh < child ? child : weekly.childHigh;
            weekly.childLow = weekly.childLow > child ? child : weekly.childLow;
        }
    })
    return weeklyBasisData;
}

/**
 * Generate random value between min (include) and max (include)
 * @param {*} min: 
 * @param {*} max 
 */
function randomRange(min, max){
    const min_ = Math.ceil(min);
    const max_ = Math.floor(max);

    return Math.floor(Math.random()  * (max - min  + 1)) + min;
}
/**
 * 
 * @returns {
 *  backgroundColor : rgba(r, g, b, a),
 *  borderColor : rgba(r, g, b, a),
 * }
 */
function generateRandomColorForChart(){
    const r = randomRange(0, 255);
    const g = randomRange(0, 255);
    const b = randomRange(0, 255);
    return {
        backgroundColor : `rgba(${r}, ${g}, ${b}, 0.4)`,
        borderColor : `rgba(${r}, ${g}, ${b}, 1)`,
    }
}

function groupByVaccineType(csv, ...vaccines){
    const weeklyVaccines = new Object();
    csv.forEach( row=>{
        const dt = DateTime.DateTime.fromJSDate(new Date(row.date));
        const key = `week ${dt.weekNumber} of ${dt.year}`
        
        // if one of row is undefined 
        if (row.daily == undefined) return;

        if (! weeklyVaccines.hasOwnProperty(key)){
            weeklyVaccines[key] = {};
        }

        vaccines.forEach( (vaccine) => {
            let vac1 = Number.parseInt(row[vaccine + "1"]);
            let vac2 = Number.parseInt(row[vaccine + "2"]); 
            let vac3 = Number.parseInt(row[vaccine + "3"]);
            vac1 = !Number.isNaN(vac1)? vac1:  0;
            vac2 = !Number.isNaN(vac2) ? vac2:  0;
            vac3 = !Number.isNaN(vac3) ? vac3 : 0;


            const vaccinetotal = vac1 + vac2 + vac3;
            //Skip
            if (vaccinetotal == NaN) return;
            if (! weeklyVaccines[key].hasOwnProperty(vaccine)){
                weeklyVaccines[key][vaccine] = vaccinetotal
            }else{
                weeklyVaccines[key][vaccine] += vaccinetotal;
            }
        })
    })
    return weeklyVaccines;

}

function createDataset(csv, fieldName, label){
    const data = []
    csv.forEach( (el) =>{ 
        if (el[fieldName] != undefined){
            data.push(el[fieldName]);
        }
    })
    const {backgroundColor, borderColor} = generateRandomColorForChart();
    return {
        backgroundColor,
        borderColor,
        data : data,
        fill : false,
        label
    }
}

module.exports = {
    filterByMonth,
    groupByState,
    filterByState,
    mapDataToWeeklyBasis,
    readCSV,
    generateRandomColorForChart,
    createDataset,
    groupByMonth,
    groupByVaccineType
}


