import { Link, Navigate, useNavigate } from 'react-router-dom';
import '../auth/auth.css';


function IntroWindow(){
    const navigate = useNavigate();
    return (
        <div className="auth-container">
            <h1>Welcome to Dotify!</h1>
        <br/>
        <br/>
            <form>
                <button type="button" className="login" onClick={() => navigate('/login')}>Login</button>
                <button type="button" className="register" onClick={() => navigate('/register')}>Register</button>
            </form>
        </div>
    );
}

export default IntroWindow;