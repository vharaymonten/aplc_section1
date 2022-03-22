import Link from "next/link"
import Container from "./container"
import { useRouter } from "next/router"
export default function Layout({children}){
    const router = useRouter();
    return (
        <>
        <Container>
            { router.pathname != "/" ? 
            <Link href={"/"}>
                <a className={"backButton"}>Back</a>
            </Link> : <></>
            }

            {children}
        </Container>
        </>
    )
}