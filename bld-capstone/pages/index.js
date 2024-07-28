import { useRouter } from "next/router";
import { useAuthContext } from '@/hooks/useAuthContext';
import { useEffect } from 'react';
import { getUserByUID } from "@/firebase/users";

export default function Home() {
    const router = useRouter();
    const { user, authIsReady } = useAuthContext();

    useEffect(() => {
        if (authIsReady == false || !user) {
            router.push('/login');
        }
    }, [authIsReady, user]);

    if (authIsReady && user) {
        getUserByUID(user.uid).then((res) => {
            if(res) {
                console.log(res.enabled);
                if(res.enabled == false) {
                    router.push("/access-message");
                } else {
                    if(res.internal) {
                        router.push("/dashboard");
                    } else {
                        router.push("/client");
                    }
                }
            }
        })
    }
}