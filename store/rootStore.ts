import userStore, {IUserStore} from './userStore'

export interface IStore {
	user: IUserStore;
}

export default function createStore (initiaValue: any): () =>IStore {
	return () => {
		return {
			user: {...userStore(), ...initiaValue?.user}
		}
	}
}
