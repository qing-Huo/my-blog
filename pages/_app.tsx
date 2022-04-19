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
    return (
		<StoreProvider initiaValue={initiaValue}>
        <Layout>
            <Component {...pageProps} />
        </Layout>
		</StoreProvider>
    ) 
}

MyApp.getInitialProps = async ({ ctx }: {ctx: any}) => {
	console.log(' *************** ')
	console.log(ctx?.req.cookies)
	const {id,avatar,nickname} = ctx?.req.cookies || {}
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
