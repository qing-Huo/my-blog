import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StoreProvider } from 'store/index'
import Layout from 'components/layout'
import { NextPage } from 'next'

interface IProps {
	initiaValue: Record<any, any>;
	Component: NextPage;
	pageProps: any;

}

function MyApp({initiaValue,Component,pageProps}:IProps) {
	const renderLayout = () => {
		if ((Component as any).layout === null) {
			return <Component {...pageProps}/>
		} else {
			return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
			)
		}
	}
    return (
		<StoreProvider initiaValue={initiaValue}>
			{renderLayout()}
		</StoreProvider>
    ) 
}

MyApp.getInitialProps = async ({ ctx }: {ctx: any}) => {
	console.log(' *************** ')
	const {id,avatar,nickname} = ctx?.req?.cookies || {}
	return {
		initiaValue: {
			user: {
				userInfo: {
					id,
					avatar,
					nickname
				}
			}
		}
	}
}

export default MyApp
