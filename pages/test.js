import Card from "../components/card"
import styles from '../styles/Home.module.css'
import Head from 'next/head'
export default function Test(){
    const titles = ["Github Page", "Jivha Page", "Bad Page"];
    return (
    <>
    <Head >
        <title>This is a test Page</title>
        <meta name="description" content="This is the description"/>
    </Head>
    <div className={styles.container}>
        <div className={styles.grid}>
            <h1>Grids</h1>
        {titles.map( el => {
            return (
            <Card key={el} title={el} content={"Profile"} link={"/chart"}/>)
        })}
        </div>
    </div>
    </>
    )
}