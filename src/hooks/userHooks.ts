import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {changeUserId, changeName, changeEmail, changeGender} from '@/state/user/userSlice';
import { RootState } from '@/state/store';
import { useRouter } from 'next/router';

export function setUserDetails() {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const dispatch = useDispatch();

    
    const fetchDataAndChangeState = async () => {
        setLoading(true);
        const response = await fetch('/api/user/validateAndGetUser');
        if (response.status !== 200) {
            router.push('/login');
        }
        const data = await response.json();
        dispatch(changeUserId(data.user_id));
        dispatch(changeName(data.name));
        dispatch(changeEmail(data.email));
        dispatch(changeGender(data.gender));
        setLoading(false);
    }

    useEffect(() => {
       fetchDataAndChangeState();
     }, []);

    return { loading };
}

export function getUserDetails() {
    const userId = useSelector((state: RootState) => state.user.id);
    const name = useSelector((state: RootState) => state.user.name);
    const email = useSelector((state: RootState) => state.user.email);
    const gender = useSelector((state: RootState) => state.user.gender);

    return { userId, name, email, gender };
}