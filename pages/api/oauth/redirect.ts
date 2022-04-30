import { NextApiRequest , NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from "next-cookie";
import { ironOptions } from 'config/index'
import {ISession} from 'pages/api/index'
import requestInstance from "service/fetch";
import {setCookie} from 'utils/index'
import { prepaerConnection } from "db/index";
import { User, UserAuth } from 'db/entity/index'

export default withIronSessionApiRoute(redirect, ironOptions)

// clientID: 9735684fbb0f530a3b5b
// client-secret: 618b00e41b6526e648b8c376b67d77ecadbea337
async function redirect( 
	req:NextApiRequest,
	res:NextApiResponse 
) {
	const session: ISession = req.session;

	// http:localshot:3000/api/oauth/redirect?code=xxx
	const { code } = req?.query || {};
	console.log(111111)
	console.log(code)
	const githubClientID = '9735684fbb0f530a3b5b'
	const githubSecret = '618b00e41b6526e648b8c376b67d77ecadbea337'
	const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecret}&code=${code}`

	const result = await requestInstance.post(url,{},{
		headers:{
			accept: 'application/json',
		}
	})

	console.log('----------------result--------------');
	console.log(result);


	const { access_token } = result as any;
	console.log('----------------access_token-----------------');
	console.log(access_token);

	const githubUserInfo = await requestInstance.get('https://api.github.com/user',{
		headers:{
			accept: 'application/json',
			Authorization: `token ${access_token}`
		}
	})
	console.log('----------------githubUserInfo-----------------');
	console.log(githubUserInfo);


	const cookies = Cookie.fromApiRoute(req,res);
	const db = await prepaerConnection()
	const userAuth = await db.getRepository(UserAuth).findOne({
		identity_type: 'github',
		identifier:githubClientID,
	},{
			relations: ['user']
	})

	console.log('----------------userAuth-----------------');
	console.log(userAuth);

	if( userAuth ) {
		//之前登陆过的用户,直接从 user 里面获取用户信息，并且更新credential
		const user = userAuth.user;
		const { id, nickname, avatar} = user; 


	console.log('----------------user-----------------');
	console.log(user);

		userAuth.credential = access_token;

		session.userId = id;
		session.nickname = nickname;
		session.avatar = avatar;

		await session.save()
		
		setCookie(cookies, {id,nickname,avatar});
		res.writeHead(302,{
			Location: '/'
		})
	} else {
		// 创建一个新用户, 包括 user && userAuth;
		const { login = '', avatar_url = "" } = githubUserInfo as any;
		const user = new User()

		user.nickname = login;
		user.avatar = avatar_url;

		const userAuth = new UserAuth()
		userAuth.identity_type = 'github';
		userAuth.identifier = githubClientID;
		userAuth.credential = access_token;
		userAuth.user = user;


		const userAuthRepo = db.getRepository(UserAuth);
		const resUserAuth = await userAuthRepo.save(userAuth);


		console.log('----------------resUserAuth----------------');
		console.log(resUserAuth);

		const { id, nickname, avatar } = resUserAuth?.user || {};
		session.userId = id;
		session.nickname = nickname;
		session.avatar = avatar;

		await session.save()

		setCookie(cookies, {id,nickname,avatar});
		res.writeHead(302,{
			Location: '/'
		})
	
	}

}
