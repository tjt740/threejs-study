import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Redirect(props) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(props.to, { replace: true });
    }, []);

    return null;
}
