import styled from 'styled-components'
import { LionProfile } from '../../assets/svg'
import * as S from './style'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Props {
    leaderName: string
    content: string
    gender: boolean
    profileImage: string
    participants: number
    postId: number
}

interface PARTYINFO {
    userName: string
    profileImage: string
    userGender: boolean
}

function DetailPartySection({ profileImage, leaderName, content, gender, participants, postId }: Props) {
    let gender2
    if (gender) {
        gender2 = '남자'
    } else {
        gender2 = '여자'
    }
    const [onlyParty, setonlyParty] = useState<PARTYINFO[]>([])
    async function getPartyOne(postId: number) {
        try {
            await axios
                .get(`http://moyeota.shop/api/posts/${postId}/members`, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_AUTH_BEARER_TEST}`,
                    },
                })
                .then((res) => {
                    if (res.status == 200) {
                        const partyInfo: PARTYINFO[] = res.data.data
                        const participants = partyInfo.filter((value) => {
                            return value.userName !== leaderName
                        })
                        setonlyParty(participants)
                    }
                })
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getPartyOne(postId)
    }, [postId])

    return (
        <S.Party>
            <S.Leader>팟장</S.Leader>
            <Wrapper>
                <S.Icon style={{ marginLeft: '24px', marginRight: '13px' }}>
                    <img style={{ borderRadius: '100%' }} src={profileImage} width="55px" height="55px" />
                </S.Icon>
                <S.Name>{leaderName}</S.Name>
                <S.Tags>
                    <S.Tag style={{ marginRight: '7px' }}>{gender2}</S.Tag>
                    <S.Tag>20대</S.Tag>
                </S.Tags>
            </Wrapper>
            <S.Description>{content}</S.Description>
            <S.PartyOne>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <S.Leader>파티원</S.Leader>
                    <TagsWrapper>
                        <S.Tags style={{}}>
                            <S.Tag style={{ marginRight: '7px' }}>{participants - 1}명</S.Tag>
                        </S.Tags>
                    </TagsWrapper>
                </div>
                {/* 나잇대 수정필요 */}
                {onlyParty.length > 0 ? (
                    onlyParty.map((value, index) => {
                        return (
                            <Wrapper key={index} style={{ paddingBottom: '16px' }}>
                                <S.Icon style={{ marginLeft: '24px', marginRight: '13px' }}>
                                    {value.profileImage ? (
                                        <img
                                            src={value.profileImage}
                                            style={{ borderRadius: '100%' }}
                                            width="55px"
                                            height="55px"
                                        />
                                    ) : (
                                        <LionProfile width="55px" height="55px" />
                                    )}
                                </S.Icon>
                                <S.Name>{value.userName}</S.Name>
                                <S.Tags style={{}}>
                                    <S.Tag style={{ marginRight: '7px' }}>{value.userGender ? '남자' : '여자'}</S.Tag>
                                    {/* 나잇대 수정필요 */}
                                    <S.Tag>20대</S.Tag>
                                </S.Tags>
                            </Wrapper>
                        )
                    })
                ) : (
                    <S.PartyoneText>아직 매칭된 파티원이 없어요!</S.PartyoneText>
                )}
            </S.PartyOne>
        </S.Party>
    )
}
export const Wrapper = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`

export const TagsWrapper = styled.div`
    flex-direction: row;
    margin-left: 11px;
    margin-top: 16px;
    display: flex;
    align-items: center;
`
export default DetailPartySection
