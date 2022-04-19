export type IUserInfo = {
	userId?: number | null;
	nickname?: string | null;
	avatar?: string;
}

export interface IUserStore {
	userInfo: IUserInfo;
	setUserInfo: (values: IUserInfo) => void;
}

const userStore = (): IUserStore => {
	return {
		userInfo: {},
		setUserInfo: function(value) {
			this.userInfo = value;
		}
	}
}

export default userStore;
