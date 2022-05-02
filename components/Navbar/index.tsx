import { useState } from 'react'
import type{NextPage} from 'next'
import {useRouter} from 'next/router'
import { observer } from 'mobx-react-lite'
import {Menu, Button ,message ,Avatar, Dropdown} from 'antd'
import { LoginOutlined, HomeOutlined } from '@ant-design/icons'
import {useStore} from 'store/index'
import requestInstance from 'service/fetch'
import styles from './index.module.scss'
import Link from 'next/link'
import Login from 'components/Login'
import { navs } from './config'
import { userInfo } from 'os'

const Navbar:NextPage = () => {
	const store = useStore();
	const {avatar,userId} = store.user.userInfo;
	const {pathname,push} = useRouter()
	const [ isShowLogin, setIsShowLogin] = useState(false)


	const handleGotoEditorPage = () => {
		if( userId ) {
			push('/editor/new')
		} else {
			message.warning('清闲登陆。。')
		}
	}

	const handleLogin = () => {
		setIsShowLogin(true)
	}

	const handleClose = () => {
		setIsShowLogin(false)
	}

	const handleGotoPersonalPage = () => {
		push(`/user/${userId}`)
	}

	const handleLogout = () => {
		requestInstance.post('/api/user/logout').then( (res: any)  => {
			if(res?.code === 0) {
				store.user.setUserInfo({})
			}
		})
	}

	const renderDropdownMenu = () => {
		return (
			<Menu>
				<Menu.Item onClick={handleGotoPersonalPage}><LoginOutlined/> &nbsp;个人主页</Menu.Item>
				<Menu.Item onClick={handleLogout}><HomeOutlined/>&nbsp;退出系统</Menu.Item>
			</Menu>
		)
	}

	return <div className={styles.navbar}>
		<section className={styles.logoArea}>BLOG-C</section>
		<section className={styles.linkArea}>
			{
			navs?.map( ( nav ) => (
				<Link key={nav?.label} href={nav?.value}>
					<a className={pathname === nav?.value ? styles.active : ''}>{nav?.label}</a>
				</Link>
			))
			}
		</section>
		<section className={styles.operationArea}>
			<Button onClick={handleGotoEditorPage}>写文章</Button>

			{
			userId ? (
				<>
					<Dropdown overlay={renderDropdownMenu()} placement="bottomLeft">
						<Avatar src={avatar} size={32}/>
					</Dropdown>
				</>
				) : (
					<Button onClick={handleLogin} type='primary'>登陆</Button>
			)
			}

		</section>
		<Login isShow={isShowLogin} onClose={handleClose}/>
	</div>
}

export default observer(Navbar)
