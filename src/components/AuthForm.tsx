import { useState } from 'react';

type AuthMode = 'login' | 'signup';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (mode === 'signup') {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      // TODO: Add signup logic
      console.log('Signup:', formData);
    } else {
      // TODO: Add login logic
      console.log('Login:', { username: formData.username, password: formData.password });
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function toggleMode() {
    setMode(mode === 'login' ? 'signup' : 'login');
    // Reset form when switching
    setFormData({
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  function handleSocialLogin(provider: string) {
    // TODO: Add social login logic
    console.log('Social login:', provider);
  }

  return (
    <div className="login-page-card">
      <form onSubmit={handleSubmit} className="login-page-form">
        {/* Inputs */}
        <div className="login-page-inputs">
          {mode === 'signup' && (
            <div className="login-page-input-wrapper">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="login-page-input"
                required
              />
            </div>
          )}
          
          <div className="login-page-input-wrapper">
            <input
              type="text"
              name="username"
              placeholder={mode === 'login' ? 'Username / Email' : 'Username'}
              value={formData.username}
              onChange={handleInputChange}
              className="login-page-input"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="login-page-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="login-page-input"
                required
              />
            </div>
          )}

          <div className="login-page-input-wrapper">
            <input
              type="password"
              name="password"
              placeholder={mode === 'login' ? 'Password' : 'Create Password'}
              value={formData.password}
              onChange={handleInputChange}
              className="login-page-input"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="login-page-input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="login-page-input"
                required
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="login-page-btn">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>

        {/* Forgot Password (only for login) */}
        {mode === 'login' && (
          <a href="#" className="login-page-forgot" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        )}
      </form>

      {/* Divider */}
      <div className="login-page-divider">
        <span className="login-page-divider-line"></span>
        <span className="login-page-divider-text">OR</span>
        <span className="login-page-divider-line"></span>
      </div>

      {/* Social Login */}
      <div className="login-page-social">
        <button 
          type="button" 
          className="login-page-social-btn"
          onClick={() => handleSocialLogin('google')}
        >
          <svg width="30" height="32" viewBox="0 0 30 32" fill="none">
            <path d="M29.9999 16.3457C29.9999 15.1265 29.9014 14.2443 29.6893 13.3313H15.2959V18.7771H23.705C23.5422 20.1934 22.6491 22.2576 20.6343 23.6432L20.6064 23.8241L25.0566 27.2698L25.3655 27.3007C28.3436 24.5936 29.9999 20.8674 29.9999 16.3457Z" fill="#4285F4"/>
            <path d="M15.2959 30.9202C19.3976 30.9202 22.8221 29.6085 25.3655 27.3008L20.6343 23.6433C19.3332 24.5562 17.5906 25.1835 15.2959 25.1835C11.2741 25.1835 7.88397 22.4764 6.64847 18.8496L6.47528 18.8647L1.84339 22.4519L1.78223 22.6167C4.30977 27.5327 9.41208 30.9202 15.2959 30.9202Z" fill="#34A853"/>
            <path d="M6.64847 18.8496C6.33812 17.8829 6.15988 16.8548 6.15988 15.7956C6.15988 14.7363 6.33812 13.7082 6.63304 12.7415L6.62463 12.5485L1.93568 8.90503L1.78223 8.97446C0.729607 11.0388 0.115234 13.354 0.115234 15.7956C0.115234 18.2372 0.729607 20.5523 1.78223 22.6167L6.64847 18.8496Z" fill="#FBBC05"/>
            <path d="M15.2959 6.40761C18.2088 6.40761 20.1894 7.65812 21.3162 8.69864L25.5589 4.64498C22.8071 2.20338 19.3976 0.670898 15.2959 0.670898C9.41208 0.670898 4.30977 4.05838 1.78223 8.97441L6.63304 12.7415C7.88397 9.11466 11.2741 6.40761 15.2959 6.40761Z" fill="#EB4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
        
        <button 
          type="button" 
          className="login-page-social-btn"
          onClick={() => handleSocialLogin('facebook')}
        >
          <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
            <path d="M29 14.5C29 6.49187 22.5081 0 14.5 0C6.49187 0 0 6.49187 0 14.5C0 21.7031 5.31937 27.7144 12.2656 28.8125V18.6719H8.57813V14.5H12.2656V11.3031C12.2656 7.65625 14.4294 5.65625 17.7456 5.65625C19.3375 5.65625 21 5.93125 21 5.93125V9.51562H19.1687C17.3669 9.51562 16.7344 10.6644 16.7344 11.845V14.5H20.8312L20.1169 18.6719H16.7344V28.8125C23.6806 27.7144 29 21.7031 29 14.5Z" fill="#1877F2"/>
          </svg>
          <span>Sign in with Facebook</span>
        </button>
      </div>

      {/* Toggle Link */}
      <p className="login-page-signup">
        {mode === 'login' ? (
          <>
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>Sign Up</a>
          </>
        ) : (
          <>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>Log In</a>
          </>
        )}
      </p>
    </div>
  );
}

