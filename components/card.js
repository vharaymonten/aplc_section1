import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Card({title, content, link}){
    return (
        
        // <div className={styles.grid}>
          <div className={styles.card}>
            <Link href={link}>
              <a >
                <h2>{title} &rarr;</h2>
                <p>{content}</p>
              </a>
            </Link>
          </div>
        // </div>
    )
}