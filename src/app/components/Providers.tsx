'use client'

import SocketProvider from "../context/socketProvider"
import UserProvider from "../context/UserProvider"



const Providers = ({ children }: any) => {
	return (
		<UserProvider>
			{children}
		</UserProvider>
	)
}

export default Providers
