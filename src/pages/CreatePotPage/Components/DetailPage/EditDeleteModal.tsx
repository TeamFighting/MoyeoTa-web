// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState } from 'react';
import DeleteModal from '../Modal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@assets/svg';
import BottomSheetHandle from '../../../MainPage/Components/BottomSheet/BottomSheetHandle';
import useUpdateModalStore from '@stores/UpdateModalStore';
import { UpdateBottomSheetMenuWrapper, UpdateIcon } from '@pages/CreatePotPage/style';

interface EditDeleteModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    postId: number;
}

const EditDeleteModal = ({ postId, isOpen }: EditDeleteModalProps) => {
    const [sheetHeight] = React.useState<number>(() => {
        return window.innerHeight * (2.5 / 8);
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { closeModal } = useUpdateModalStore();

    const navigate = useNavigate();
    const goToUpdate = () => {
        closeModal();
        navigate(`/updatepot/${postId}`);
    };

    const OpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
        console.log(isDeleteModalOpen);
    };

    const CloseDeleteModal = () => {
        closeModal();
        setIsDeleteModalOpen(false);
    };

    return (
        <BottomSheetContainer
            onClick={() => {
                closeModal();
            }}
            style={{ display: isOpen ? 'flex' : 'none' }}
        >
            <BottomSheetContent style={{ height: `${sheetHeight}px` }}>
                <BottomSheetHandle />
                <UpdateBottomSheetMenuWrapper>
                    <UpdateIcon>
                        <PencilIcon width="24" height="24" />
                    </UpdateIcon>
                    <UpdateText onClick={goToUpdate}>수정하기</UpdateText>
                </UpdateBottomSheetMenuWrapper>
                <UpdateBottomSheetMenuWrapper>
                    <UpdateIcon>
                        <TrashIcon width="24" height="24" />
                    </UpdateIcon>
                    <DeleteText onClick={OpenDeleteModal}>삭제하기</DeleteText>
                </UpdateBottomSheetMenuWrapper>
                <CancleText onClick={closeModal}>취소</CancleText>
            </BottomSheetContent>
            {isDeleteModalOpen && <DeleteModal postId={postId} onClose={CloseDeleteModal}></DeleteModal>}
        </BottomSheetContainer>
    );
};

export default EditDeleteModal;

const BottomSheetContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(65, 65, 65, 0.4);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
`;

const BottomSheetContent = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    background-color: white;
    border-radius: 26px 26px 0px 0px;
`;

const UpdateText = styled.span`
    color: var(--Gray-Text-3, #343434);
    font-family: Pretendard;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 157%; /* 34.54px */
    text-align: center;
`;

const DeleteText = styled.div`
    color: #f00;
    text-align: center;
    font-family: Pretendard;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 157%; /* 34.54px */
`;

const CancleText = styled.div`
    color: var(--Gray-Text-1, #9a9a9a);
    font-family: Pretendard;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 157%; /* 34.54px */
    text-align: center;
    padding-top: 20px;
`;
