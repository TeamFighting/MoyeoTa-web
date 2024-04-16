import { Chevronleft } from '../../assets/svg';
import { ChatHeader } from '../FirebaseChat/ChatLists';

function Header() {
    const handleGoback = () => {
        window.history.back();
    };
    return (
        <ChatHeader style={{ width: '90%' }}>
            <Chevronleft onClick={handleGoback} width={24} height={24} />
        </ChatHeader>
    );
}

export default Header;
