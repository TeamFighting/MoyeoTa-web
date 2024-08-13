import { useRef, useEffect } from 'react';
import { BOTTOM_SHEET_MIN_Y, BOTTOM_SHEET_MAX_Y, BANKLIST_SHEET_MIN_Y, BANKLIST_SHEET_MAX_Y } from '@constants';
import { match } from 'ts-pattern';

interface BottomSheetMetrics {
    touchStart: {
        sheetY: number;
        touchY: number;
    };
    touchMove: {
        prevTouchY?: number;
        movingDirection: 'none' | 'down' | 'up';
    };
    isContentAreaTouched: boolean;
}

type BottomSheetFrom = 'Mainpage' | 'BankListSheet' | 'OwnerReimbursement';

interface BottomSheetProps {
    from: BottomSheetFrom;
    setIsBottomSheetOpen?: (clickedAccountList: boolean) => void;
}
export default function useBottomSheet({ from, setIsBottomSheetOpen }: BottomSheetProps) {
    let MIN_Y: number, MAX_Y: number;
    match(from)
        .with('Mainpage', () => {
            MIN_Y = BOTTOM_SHEET_MIN_Y;
            MAX_Y = BOTTOM_SHEET_MAX_Y;
        })
        .with('BankListSheet', () => {
            MIN_Y = BANKLIST_SHEET_MIN_Y;
            MAX_Y = BANKLIST_SHEET_MAX_Y;
        })
        .otherwise(() => {
            MIN_Y = BOTTOM_SHEET_MIN_Y;
            MAX_Y = BOTTOM_SHEET_MAX_Y;
        });
    const sheet = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const metrics = useRef<BottomSheetMetrics>({
        touchStart: {
            sheetY: 0,
            touchY: 0,
        },
        touchMove: {
            prevTouchY: 0,
            movingDirection: 'none',
        },
        isContentAreaTouched: false,
    });

    useEffect(() => {
        // 컨텐츠 영역 터치시 바텀시트가 올라가지 않도록
        const canUserMoveBottomSheet = () => {
            const { touchMove, isContentAreaTouched } = metrics.current;
            const scrollTop = content.current!.scrollTop;
            if (isContentAreaTouched && scrollTop > 0) {
                return false;
            }

            if (sheet.current!.getBoundingClientRect().y !== MIN_Y) {
                return true;
            }

            if (touchMove.movingDirection === 'down') {
                return content.current!.scrollTop <= 0;
            }
            return false;
        };

        const handleTouchStart = (e: TouchEvent) => {
            const { touchStart } = metrics.current;
            touchStart.sheetY = sheet.current!.getBoundingClientRect().y;
            touchStart.touchY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const { touchStart, touchMove } = metrics.current;
            const currentTouch = e.touches[0];
            if (touchMove.prevTouchY === undefined) {
                touchMove.prevTouchY = touchStart.touchY;
            }

            if (touchMove.prevTouchY === 0) {
                // 맨 처음 앱 시작하고 시작시
                touchMove.prevTouchY = touchStart.touchY;
            }

            // 방향 설정
            if (touchMove.prevTouchY < currentTouch.clientY) {
                touchMove.movingDirection = 'down';
            }

            if (touchMove.prevTouchY > currentTouch.clientY) {
                touchMove.movingDirection = 'up';
            }

            // 위로 스크롤 중 컨텐츠 영역이 스크롤 되지 않을 때만 바텀시트가 올라가도록
            if (canUserMoveBottomSheet()) {
                const touchOffset = currentTouch.clientY - touchStart.touchY;
                let nextSheetY = touchStart.sheetY + touchOffset;

                if (nextSheetY <= MIN_Y) {
                    nextSheetY = MIN_Y;
                }

                if (nextSheetY >= MAX_Y) {
                    nextSheetY = MAX_Y;
                }
                sheet.current!.style.setProperty('transform', `translateY(${nextSheetY - MAX_Y}px)`); //바닥 만큼은 빼줘야함.
            } else {
                document.body.style.overflowY = 'scroll';
            }
        };

        const handleTouchEnd = () => {
            document.body.style.overflowY = 'scroll';
            const { touchMove } = metrics.current;

            // Snap Animation
            const currentSheetY = sheet.current!.getBoundingClientRect().y;

            if (currentSheetY !== MIN_Y) {
                if (touchMove.movingDirection === 'down' && content.current!.scrollTop <= 0) {
                    if (setIsBottomSheetOpen) setIsBottomSheetOpen(false);
                    console.log('snap down');
                    sheet.current!.style.setProperty('transform', 'translateY(0)');
                }

                if (touchMove.movingDirection === 'up') {
                    sheet.current!.style.setProperty('transform', `translateY(${MIN_Y - MAX_Y}px)`);
                }
            }

            // metrics 초기화.
            metrics.current = {
                touchStart: {
                    sheetY: 0,
                    touchY: 0,
                },
                touchMove: {
                    prevTouchY: 0,
                    movingDirection: 'none',
                },
                isContentAreaTouched: false,
            };
        };

        if (sheet.current) {
            sheet.current.addEventListener('touchstart', handleTouchStart);
            sheet.current.addEventListener('touchmove', handleTouchMove);
            sheet.current.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (sheet.current) {
                sheet.current.removeEventListener('touchstart', handleTouchStart);
                sheet.current.removeEventListener('touchmove', handleTouchMove);
                sheet.current.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, []);

    const handleUp = () => {
        if (sheet.current === null) return;
        sheet.current!.style.setProperty('transform', `translateY(${MIN_Y - MAX_Y}px)`);

        // metrics 초기화.
        metrics.current = {
            touchStart: {
                sheetY: 0,
                touchY: 0,
            },
            touchMove: {
                prevTouchY: 0,
                movingDirection: 'none',
            },
            isContentAreaTouched: false,
        };
    };

    const handleDown = () => {
        sheet.current!.style.setProperty('transform', `translateY(${MAX_Y}px)`);
        if (setIsBottomSheetOpen) setIsBottomSheetOpen(false);
        // metrics 초기화.
        metrics.current = {
            touchStart: {
                sheetY: 0,
                touchY: 0,
            },
            touchMove: {
                prevTouchY: 0,
                movingDirection: 'none',
            },
            isContentAreaTouched: false,
        };
    };

    useEffect(() => {
        const handleTouchStart = () => {
            metrics.current!.isContentAreaTouched = true;
        };

        if (content.current) content.current!.addEventListener('touchstart', handleTouchStart);
        return () => {
            if (content.current) content.current!.removeEventListener('touchstart', handleTouchStart);
        };
    }, []);

    return { sheet, content, handleUp, handleDown };
}
