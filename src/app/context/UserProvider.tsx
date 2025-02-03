import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface CartContext {
	user: any
	updateUser(user: any): void
	removeUser(): void
}

// const updateUserInCookies = (userData: any) => {
// 	Cookies.set('user', JSON.stringify(userData))
// }

const UserContext = createContext<CartContext>({
	user: {},
	updateUser() {},
	removeUser() {},
})

const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<any>({})

	const removeUser = () => {
		setUser({})
	}

	const updateUser = (userData: any) => {
		setUser(userData)
	}

	useEffect(() => {
		const result = Cookies.get('user')
		if (result) {
			setUser(JSON.parse(result))
		}
	}, [])

	return (
		<UserContext.Provider
			value={{
				user,
				updateUser,
				removeUser,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export default UserProvider

export const useUser = () => useContext(UserContext)
