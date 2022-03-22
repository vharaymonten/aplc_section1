import Head from 'next/head'
import Image from 'next/image'
import Card from '../components/card'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Jivha Raymond Lie | APLC Assignment </title>
        <meta name="description" content="APLC Assignment implementation by Jivha Raymond Lie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/vharaymonten">APLC Project</a>
        </h1>

        
        <div className={styles.grid}>

          <Card title={"Number 1 part A"} content={"Vaccination Records Malaysia"} link={"/vax"}/>
          <Card title={"Number 1 part B"} content={"Vaccination Registrations Records Malaysia"} link={"/vaxreg"}/>
          <Card title={"Number 2"} content={"Vaccines taken by States and Month"} link={"/number2"}/>
          <Card title={"Number 3"} content={"Highest and Lowest vaccine taken weekly by adult and child"} link={"/number3"}/>
          <Card title={"Number 4"} content={"Vaccines taken weekly"} link={"/number4"}/>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </Layout>
  )
}
