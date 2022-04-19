import React,{createContext, ReactElement, useContext} from "react"
import { useLocalObservable, enableStaticRendering  } from 'mobx-react-lite'
import createStore, { IStore } from "./rootStore"

enableStaticRendering(true)

interface IProps {
	initiaValue: Record<any, any>;
	children: ReactElement;
}
const StoreContext = createContext({})

export const StoreProvider = ({initiaValue, children }: IProps) => {
	const store:IStore = useLocalObservable(createStore(initiaValue))
	return (
		<StoreContext.Provider value={store}>
			{children}
		</StoreContext.Provider>
	)
}

export const useStore = () => {
	const store: IStore = useContext(StoreContext) as IStore;
	if (!store) {
		throw new Error ('store中数据不存在');
	}
	return store;
}
