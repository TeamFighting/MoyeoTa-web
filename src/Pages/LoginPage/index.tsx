import styled from 'styled-components';
import Body from './Body';
import Header from './Header';
import { useEffect } from 'react';

function LoginPage() {
    useEffect(() => {
        const haveToken = sessionStorage.getItem('accessToken');
        if (haveToken !== null) {
            window.location.href = '/mainpage';
        }
    }, []);

    return (
        <Container>
            <Header />
            <Body />
        </Container>
    );
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;
export default LoginPage;
