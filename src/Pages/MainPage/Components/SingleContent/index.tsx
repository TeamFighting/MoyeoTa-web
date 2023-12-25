import * as S from '../../style'
import Profile from './Profile'
import ArrowRight from '../../../../../public/svg/ArrowRight.svg'
import LocationMarker from '../../../../../public/svg/LocationMarker.svg'
import Clock from '../../../../../public/svg/Clock.svg'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ISOto12 from './ISOto12'
import getDays from './getDays'
import createAgo from './createAgo'
import { useQuickPotStore } from '../../../../zustand/store/QuickPotStore'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useStore from '../../../../zustand/store/ContentStore'
import { instance } from '../../../../axios'

function SingleContent() {
    const [ref, inView] = useInView()
    const [page, setPage] = useState(1) // 현재 페이지 번호 (페이지네이션)

    const { updateTotalData } = useStore((state) => state)

    const productFetch = () => {
        instance
            .get(` /posts?page=${page}`)
            .then((res) => {
                updateTotalData(res.data.data.content)
            })
            .catch((err) => {
                console.log(err)
            })
        setPage((page) => page + 1)
    }

    useEffect(() => {
        if (inView) {
            productFetch()
        }
        if (!inView) {
            // console.log(inView, '무한 스크롤 요청 안함')
        }
    }, [inView])

    const navigate = useNavigate()
    const { totalData } = useStore((state) => state)
    const navigateToDetail = (data: object, splitedTime: string[], timePart: string, postId: number) => {
        navigate(`/detailpage/${postId}`, {
            state: {
                data: data,
                splitedTime: splitedTime,
                timePart: timePart,
            },
        })
    }
    const { quickPot } = useQuickPotStore()

    return (quickPot.length !== 0 ? quickPot : totalData).map((data, index) => {
        const splitedDay = getDays(data.departureTime)
        const timePart = ISOto12(data.departureTime)
        const ago = createAgo(data.createAt)
        const postId = data.postId
        let gender
        console.log(data)
        if (!data.userGender) {
            gender = '여'
        } else {
            gender = '남'
        }
        return (
            <S.SingleContent
                ref={index === totalData.length - 1 ? ref : null}
                key={index}
                onClick={() => {
                    navigateToDetail(data, splitedDay, timePart, postId)
                }}
            >
                <Profile
                    profileImg={data.profileImage}
                    ago={ago}
                    index={index}
                    userName={data.userName}
                    gender={gender}
                    distance={data.distance}
                />
                <S.ContentTitle>{data.title}</S.ContentTitle>
                <div key={index}>
                    <S.Info>
                        <S.Route>
                            <LocationMarker />
                            <S.From> {data.departure} </S.From>
                            <ArrowRight />
                            <S.To> {data.destination} </S.To>
                        </S.Route>
                        <S.Time>
                            <Clock />
                            <S.StartTime>
                                {splitedDay[1]}월{splitedDay[2]}일 ({splitedDay[3]}) {timePart} 출발
                            </S.StartTime>
                        </S.Time>
                    </S.Info>
                    <S.Line />
                    <Bottom>
                        <Tags>
                            <Tag>{data.vehicle}</Tag>
                            {!data.sameGenderStatus && <Tag>성별무관</Tag>}
                            {data.sameGenderStatus && data.userGender && <Tag>남자만</Tag>}
                            {data.sameGenderStatus && !data.userGender && <Tag>여자만</Tag>}
                            <Tag>{data.category}</Tag>
                        </Tags>
                        <Status>
                            {data.status === 'RECRUITING' && (
                                <GaterStatus>
                                    모집중 {data.numberOfParticipants} / {data.numberOfRecruitment}
                                </GaterStatus>
                            )}
                        </Status>
                    </Bottom>
                </div>
            </S.SingleContent>
        )
    })
}

export default SingleContent

const Bottom = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 18px;
    margin-left: 22px;
    align-items: center;
`

const Tags = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
`
const Tag = styled.div`
    font-size: 10px;
    font-weight: 600;
    color: #7e7e7e;
    display: flex;
    margin-right: 9px;
    border-radius: 4px;
    background-color: #f5f6f8;
    padding: 2px 4px;
`
const Status = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex: 1;
`
const GaterStatus = styled.div`
    color: var(--Green-Text, #139b59);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 157%; /* 18.84px */
    border-radius: 4px;
    border: 1px solid #ebebeb;
    padding: 3px 11px;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    margin-right: 15px;
`
