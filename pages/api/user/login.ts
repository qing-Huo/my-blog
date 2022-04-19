
import { NextApiRequest , NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from "next-cookie";
import { ironOptions } from 'config/index'
import {ISession} from 'pages/api/index'
import {setCookie} from 'utils/index'
import { prepaerConnection } from "db/index";
import { User, UserAuth } from 'db/entity/index'

export default withIronSessionApiRoute(login, ironOptions)

async function login( 
	req:NextApiRequest,
	res:NextApiResponse 
) { 
	const session: ISession = req.session;
	const { identity_type = 'phone',phone='', verify=''} = req.body;
	const db = await prepaerConnection();
	const userAuthRepo = db.getRepository(UserAuth)
	const userRepo = db.getRepository(User)
	//const users = await userRepo.find()
	const cookies = Cookie.fromApiRoute(req,res)

	console.log('start------------------------------------------------------');

	console.log(session.verifyCode);
	console.log(verify);


	if( String(session.verifyCode) === String(verify)) {
		//验证码正确，在 user_auths 表中查找 identity_type 是否有记录
		const userAuth = await userAuthRepo.findOne({
			identity_type,
			identifier: phone,
			}, {
				relations: ['user'],
		})

		console.log('XXXXXXXXXXXXXX')
		console.log(phone)
		console.log(verify)

		console.log(99999);
		console.log(userAuth);


		if( userAuth ) {
			//	已经存在的用户
			const user = userAuth.user;
			const { id, nickname, avatar } = user;

			session.userId = id;
			session.avatar = avatar;
			session.nickname = nickname;

			await session.save()
			setCookie(cookies,{ id, avatar, nickname })

			res?.status(200).json({code:0,msg:'登陆成功1',data:{
				userId: id,
				nickname,
				avatar,
			}})
		} else {
			// 新用户， 自动注册
			const user = new User()
			user.nickname = `用户_${Math.floor(Math.random() * 10000)}`
			user.avatar = '/images/avatar.jpg'
			user.job = "暂时没有"
			user.introduce = "暂时没有"


			const userAuth = new UserAuth()
			userAuth.identifier = phone;
			userAuth.identity_type = identity_type;
			userAuth.credential = session.verifyCode;
			userAuth.user = user;

			const resUserAuth = await userAuthRepo.save(userAuth)
			const { user: {id,nickname, avatar}} = resUserAuth;
			session.userId = id;
			session.nickname = nickname;
			session.avatar = avatar;

			await session.save()
			console.log(666666);
			console.log(resUserAuth);


			setCookie(cookies,{ id, avatar, nickname })

			res?.status(200).json({code:0,msg:'登陆成功2',data:{
				userId: id,
				nickname,
				avatar,
			}})
		}

	} else {
		res?.status(200).json({code: -1, msg: '验证码错误'})
	}

}
