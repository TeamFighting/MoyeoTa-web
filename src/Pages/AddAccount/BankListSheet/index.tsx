import styled from 'styled-components';
import { motion } from 'framer-motion';
import useBottomSheet from '../../../Hooks/useBottonSheet';
import { useEffect, useState } from 'react';
import { instance } from '../../../axios';
import { useAccountStore } from '../../../state/store/AccountStore';
const BankName = [
    { name: 'NH농협', url: '../../../../public/png/NH.png' },
    { name: '카카오뱅크', url: '../../../../public/png/KAKAO.png' },
    { name: 'KB국민', url: '../../../../public/png/KB.png' },
    { name: '토스뱅크', url: '../../../../public/png/Toss.png' },
    { name: '신한', url: '../../../../public/png/SinHan.png' },
    { name: '우리', url: '../../../../public/png/Woori.png' },
    { name: 'IBK기업', url: '../../../../public/png/IBK.svg' },
    { name: '하나', url: '../../../../public/png/Hana.png' },
    { name: '새마을', url: '../../../../public/png/SaeMaeul.png' },
    { name: '부산', url: '../../../../public/png/BNK.png' },
    { name: '대구', url: '../../../../public/png/DGB.png' },
    { name: '케이뱅크', url: '../../../../public/png/KBank.png' },
    { name: '신협', url: '../../../../public/png/Sinhyup.png' },
    { name: '광주', url: '../../../../public/png/Kwangju.png' },
    { name: '수협', url: '../../../../public/png/Suhyup.png' },
    { name: '전북', url: '../../../../public/png/Jeonbuk.png' },
    { name: '제주', url: '../../../../public/png/Jeju.png' },
    { name: '씨티', url: '../../../../public/png/Jeju.png' },
];
function BankListSheet({ handleClickUp, accountNumber }: { handleClickUp: boolean; accountNumber: string }) {
    const { sheet, handleUp, content, handleDown } = useBottomSheet('BottomSheet');
    const { setAccountName } = useAccountStore();
    const [handleClick, setHandleClick] = useState(handleClickUp);
    useEffect(() => {
        if (handleClick) {
            handleUp();
            setHandleClick(false);
        }
        return () => {
            handleUp();
        };
    }, [handleClickUp]);

    const selectBankName = (selectedBankName: string) => {
        setAccountName(selectedBankName);
        handleDown();
    };

    const postBankName = async (selectedBankName: string) => {
        const res = await instance.post(
            '/users/account',
            {
                accountNumber: accountNumber,
                bankName: selectedBankName,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            },
        );
        console.log(res);
    };

    return (
        <Wrapper ref={sheet}>
            <div
                style={{
                    width: '100%',
                    height: 'wrap-content',
                    borderRadius: '20px',
                }}
            >
                <HeaderWrapper>
                    <Handler />
                </HeaderWrapper>
                <div ref={content} style={{ width: '100%', height: '400px' }}>
                    <BottmSheetText
                        style={{
                            height: '40px',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        은행을 선택해주세요
                    </BottmSheetText>
                    <BottomSheetContentWrapper>
                        <Grid>
                            {BankName.map((item) => (
                                <div>
                                    <BankNames onClick={() => selectBankName(item.name)}>
                                        <img src={item.url} style={{ width: '24px', height: '24px' }} />
                                        <div>{item.name}</div>
                                    </BankNames>
                                </div>
                            ))}
                        </Grid>
                    </BottomSheetContentWrapper>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled(motion.div)<{ isMaxHeight: boolean }>`
    display: flex;
    flex-direction: column;
    height: 300px;
    width: 100%;
    transition: transform 200ms ease-out;
    justify-content: center;
    align-items: center;
    bottom: 0;
`;

const BottomSheetContentWrapper = styled.div`
    height: 450px;
    overflow: scroll;
    border-radius: 0 0 26px 26px;
    display: flex;
    padding: 0 10px;
    background-color: #f5f6f8;
    display: flex;
    flex-direction: column;
`;
const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
`;
const BankNames = styled.div`
    font-size: 12px;
    font-weight: 400;
    width: 100px;
    height: 80px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e0e0e0;
    flex-direction: column;
`;
const BottmSheetText = styled.div`
    height: 100%;
    font-size: 20px;
    width: 100%;
    color: #000;
    font-family: Pretendard;
    font-size: 20px;
    padding: 0 10px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    position: sticky;
    background-color: #f5f6f8;
`;
const HeaderWrapper = styled.div`
    width: 100%;
    height: 20px;
    background-color: #f5f6f8;
    border-radius: 26px 26px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Handler = styled.div`
    right: 0;
    justify-content: center;
    align-self: center;
    cursor: pointer;
    border-radius: 26px;
    background-color: #ededed;
    width: 50px;
    height: 7px;
`;

export default BankListSheet;
