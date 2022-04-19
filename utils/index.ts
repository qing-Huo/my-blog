
interface ICookieInfo {
	id: number,
	avatar: string,
	nickname: string
}
export const setCookie = (cookies: any, 
	{id, avatar, nickname}: ICookieInfo) => {
	// 登陆时效 24h
	const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) 
	const path = '/'

	cookies.set('userId',id,{
		path,
		expires,
	})
	cookies.set('avatar',avatar,{
		path,
		expires,
	})
	cookies.set('nickname',nickname,{
		path,
		expires,
	})
}
