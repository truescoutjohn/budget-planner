import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
    const { data: session } = useSession();
    if (!session) {
        return (
            <div>
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        )
    }
}
export default Header;