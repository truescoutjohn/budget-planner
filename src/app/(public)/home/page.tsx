"use client";

import Header from "../../../components/general/Header";
import { useSession, signIn, signOut } from "next-auth/react";
import { AuthForm } from "../../../components/forms/authentication";

const Home = () => {
    const { data: session } = useSession();
    console.warn(session);
    return (
        <>
            <Header />
            <AuthForm />
        </>
    )
}

export default Home;