import Countdown from 'components/CountDown';
import React ,{ ChangeEvent, useState } from 'react';
import { observer } from 'mobx-react-lite'
import { message } from 'antd'
import {useStore} from 'store/index'
import requestInstance from 'service/fetch';
import styles from './index.module.scss'

interface IProps {
	isShow: boolean;
	onClose: Function;
}

const Login = ( props: IProps) => {

	const store = useStore()

	console.log(123);
	console.log(store);
	
	

	const { isShow , onClose} = props;
	const [ form, setForm ] = useState({
		phone: '',
		verify: ''
	})

	const [ isShowVerifyCode, setIsShowVerifyCode ] = useState(false)

	const handleClose = () => {
		onClose && onClose()
	}

	// verifyCode	验证码防抖的定时器
	let timer:any = null;
	const handleVerifyCode = () => {
		// setIsShowVerifyCode(true)
		return ( ) => {
			clearTimeout(timer)

			timer = setTimeout( () => {
				if( !form?.phone ) {
					message.warning('请输入手机号')
					console.log(33);
					return ;
				} 

				requestInstance.post('/api/user/sendVerifyCode',{
					to: form?.phone,
					templateId: 1
				})
			},500) 
		}

	}

	let timerLogin: any = null;
	const handleLogin = () => {
		return () => {
			clearTimeout(timerLogin)

			timerLogin = setTimeout(() => {
				requestInstance.post('/api/user/login',{
					...form,
					identity_type: 'phone',
					}).then( ( res: any) => {
					if(res?.code === 0) { 
							//登陆成功
							store.user.setUserInfo(res?.data)
							console.log(333)
							console.log(store)
							onClose && onClose();
						} else {
							message.error(res?.msg || "未知错误222")
						}
				})
			}, 500);
		}
	}

	// clientID: 9735684fbb0f530a3b5b
	// client-secret: 618b00e41b6526e648b8c376b67d77ecadbea337
	 const handleOAuthGithub = () => {
		const githubClientID = '9735684fbb0f530a3b5b';
		const redirectUri = 'http://localhost:3000/api/oauth/redirect'
		window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientID}&redirect_uri=${redirectUri}`)
	}

	const handleFormChange = (evt: ChangeEvent<HTMLInputElement>) => {

		const { name, value } = evt.target;
		setForm({
			...form,
			[name]: value
		})
	}

	const handleCountDownEnd = () => {
		setIsShowVerifyCode(false)
	}

	return  isShow ? 
		(
			<div className={styles.loginArea}>
				<div className={styles.loginBox}>
					<div className={styles.loginTitle}>
						<div>手机号登陆</div>
						<div onClick={handleClose} className={styles.close}>x</div>
					</div>
					<input onChange={handleFormChange} value={form.phone} name='phone' type="text" placeholder='请输入手机号'/>
					<div className={styles.verifyCodeArea}>
						<input onChange={handleFormChange} value={form.verify} name='verify' type="text" placeholder='请输入验证码' />
						<span onClick={handleVerifyCode()} className={styles.verifyCode}>
							{ isShowVerifyCode ? <Countdown time={10} onEnd={handleCountDownEnd} /> : '获取验证码'}
						</span>
					</div>
					<div onClick={handleLogin()} className={styles.loginBtn}>登陆</div>
					<div onClick={handleOAuthGithub} className={styles.otherLogin}>使用 Github 登陆</div>
					<div className={styles.loginPrivacy}>
						注册即表示用意
						<a href='https://www.jd.com' target='_blank'>隐私政策</a>
					</div>
				</div>
			</div>
		)
	: null

}

export default observer(Login)
