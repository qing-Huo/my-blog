import { NextApiRequest , NextApiResponse } from "next";
import { format } from "date-fns";
import md5 from 'md5'
import { encode } from "js-base64"; 
import { withIronSessionApiRoute } from 'iron-session/next'
import requestInstance from "service/fetch";
import { ironOptions } from 'config/index'
import { ISession } from 'pages/api/index'

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)

async function sendVerifyCode( req:NextApiRequest,res:NextApiResponse ) {

	const session: ISession = req.session;
	const { to='', templateId='1' } = req.body;
	const AccountID = '8a216da87fe39f9f017feecbd3740105'
	const AuthToken = '734110f6749f405ea2eeecfb448ee6d3'
	const NowDate = format(new Date(), 'yyyyMMddHHmmss')
	const SigParameter = md5(`${AccountID}${AuthToken}${NowDate}`)
	const Authorization = encode(`${AccountID}:${NowDate}`)
	const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountID}/SMS/TemplateSMS?sig=${SigParameter}`
	const AppId = `8a216da87fe39f9f017feecbd486010c`
	const verifyCode = Math.floor(Math.random() * (9999 - 1000) + 1000 )
	const expireMinute = '5';


	const response = await requestInstance.post(url,{
		to,
		templateId,
		appId: AppId,
		datas: [verifyCode, expireMinute]
	},{
			headers: {
				Authorization,
			}
	})

	console.log(222222)
	console.log(verifyCode);
	console.log(response)

	const { templateSMS,statusCode, statusMsg } = response as any;

	if( statusCode === '000000' ) {
		session.verifyCode = verifyCode;
		await session.save();
		res.status(200).json({
			code: 0,
			msg: statusMsg,
			data: {
					templateSMS,
			}
		})

	} else {
		res.status(200).json({
			code: statusCode,
			msg: statusMsg,
		})
		}

	}
