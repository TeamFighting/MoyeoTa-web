import { GoogleLogin, KakaoLogin, NaverLogin } from '../../assets/svg';
import * as S from './style';

function Body() {
    const KAKAOLOGIN = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
        import.meta.env.VITE_KAKAO_REST_API_KEY
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;
    const NAVERLOGIN = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
        import.meta.env.VITE_NAVER_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&state=nid/me`;
    const GOOGLELOGIN = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
        import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code&scope=email%20profile`;
    const NavToLogin = (from: string) => {
        if (from === 'KAKAO') {
            window.location.href = KAKAOLOGIN;
            console.log('카카오로 로그인');
        }
        if (from === 'GOOGLE') {
            window.location.href = GOOGLELOGIN;
        }
        if (from === 'NAVER') {
            window.location.href = NAVERLOGIN;
        }
    };
    return (
        <S.Wrapper>
            <div>
                <S.Title>
                    반가워요 ! <br /> 회원 가입을 해주세요
                </S.Title>
                <S.Explanation>휴대폰 번호는 안전하게 보관됩니다.</S.Explanation>
            </div>
            <S.LoginSection>
                <S.LoginButtons>
                    <S.Icon onClick={() => NavToLogin('KAKAO')}>
                        <KakaoLogin />
                    </S.Icon>
                    <S.Icon onClick={() => NavToLogin('GOOGLE')}>
                        <GoogleLogin />
                    </S.Icon>
                    <S.Icon onClick={() => NavToLogin('NAVER')}>
                        <NaverLogin />
                    </S.Icon>
                </S.LoginButtons>
                <S.LoginExplanation>SNS계정으로 시작하기</S.LoginExplanation>
            </S.LoginSection>
        </S.Wrapper>
    );
}

export default Body;
