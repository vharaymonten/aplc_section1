// const { doesNotThrow } = require('assert');
const DateTime = require('luxon');
import papaparse from 'papaparse';
function readCSV(csvString){
    return new Promise((resolve) => {
        const parseResult = papaparse.parse(csvString, {
            header : true,
        });

        resolve(parseResult.data);
    })
}

async function displayCSV(){
    const results = await readCSV("vax_malaysia.csv");
    
    results.results.forEach(element => {
        console.log(element.date);

        console.log("--------");
    });
}

export  default function groupByState(results){
    // This function is pure as it does not depend on other variable outside of this local function scope 
    const states = new Object();
    
    // Fetch the state first
    results.forEach(el =>{
        
        if (el.state == undefined){
            return
        }
        // Create a property in JS objec if does not exist. 
        if (! states.hasOwnProperty(el.state)){
            states[el.state] = Number.parseInt(el.daily_full);
        }else{
        // Add the cumulative to the existing states
            states[el.state] += Number.parseInt(el.daily_full);
        }

    })
    
    // Create labels for histogram
    const labelX = Object.keys(states);
    //create Dataset for Y axis
    const dataY = labelX.map( state => states[state]);
    console.log(dataY);
    return {
        states : labelX,
        dataY : dataY
    }

}

export async function filterByMonth(results,month){
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

function sumFullyVacinated(data){
    const sum = data.reduce( (prev, next) => prev + parseInt(next.daily_full), 0);
    return sum;
}

function mapDataToWeeklyBasis(data){
    const weeklyBasisData = {};
    data.forEach( row => {

        const dt = DateTime.DateTime.fromJSDate(new Date(row.date));
        const key = `${dt.year}-${dt.weekNumber}`
        if (Object.keys(weeklyBasisData).includes(key)){
            weeklyBasisData[key].total = parseInt(row.daily_full);
        }else{
            weeklyBasisData[key] = {
               total: parseInt(row.daily_full),
               start : dt.toISODate(),
               end : dt.endOf('week').toISODate()
            }
        }
    })
    return weeklyBasisData;
}

function totalByVaccineType(data, type){
   const type1 = type + "1";
   const type2 = type + "2";
   const type3 = type + "3";

   const total = data.reduce( (total, row) => {
        return total +  (parseInt(row[type1]) + parseInt(row[type2]) + parseInt(row[type3]));
   }, 0)

   return total;
}

async function run(){
    const data = await filterByState("Johor");
    const sumResult = sumFullyVacinated(data);
    return sumResult;
}

async function runNumber3(){
    const data = await readCSV("vax_malaysia.csv");
    // const data = await filterByState("Johor");
    const total = totalByVaccineType(data, "pfizer");
    console.log(total);
    const weeklyBasisData = mapDataToWeeklyBasis(data);
    const keys = Object.keys(weeklyBasisData);
    let maxKey = keys[0];
    keys.forEach( k => {
        if (weeklyBasisData[k].total > weeklyBasisData[maxKey].total){
            maxKey = k;
        }
    })
    console.log(weeklyBasisData[maxKey]);
}

module.exports = {
    filterByMonth,
    groupByState,
    filterByState,
    sumFullyVacinated,
    mapDataToWeeklyBasis,
    totalByVaccineType,
    readCSV,
}