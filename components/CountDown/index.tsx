import { useEffect, useState } from "react";
import styles from './index.module.scss'

interface IProps {
    time: number;
    onEnd: Function;
}

const CountDown = ( props: IProps ) => {
    const { time , onEnd } = props;
    const [ count, setCount ] = useState(time || 60)

    useEffect(() => {
        const timer = setInterval( ( ) => {
            setCount((count) => {
                if( count === 0 ) {
                    clearInterval(timer)
                    onEnd && onEnd()
                    return count
                } 
                return count -1
            })
        },1000)

        return () => {
            clearInterval(timer)
        }
    },[time,onEnd])

    return <div className={styles.countdown}>{count}</div>
}

export default CountDown