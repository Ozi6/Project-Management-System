import { useNavigate } from 'react-router-dom';
import './TopBar.css';

const TopBar = () =>
{
    const navigate = useNavigate();

    return (
        <div className="topbar">
            <h1
                className="page-title"
                onClick={() => navigate('/')}
            >
                PlanWise
            </h1>
            <div className="topbar-buttons">
                <button>Temp1</button>
                <button>Temp2</button>
                <button>Temp3</button>
            </div>
        </div>
    );
};
export default TopBar;