import { Shield, Lock } from "lucide-react";
import { AppHeader } from "./AppHeader";

export const HomeLayout = () => {
  return (
    <div className="home-layout">
      <div className="home-layout__result">
        {" "}
        <div className="main-header">
          <div className="lock-icon">
            <Lock size={24} />
          </div>
          <h1 className="title">Market Volatity Explorer</h1>
          <p className="subtitle">Explore your options safe and easy</p>
        </div>
        <AppHeader />
        <div className="main-security-notice">
          <div className="security-icon">
            <Shield size={16} />
          </div>
          <div className="security-text">
            <strong>Contact Suport </strong>
            <p>
              This is a demo application, reach out to me at
              sonalkumari6454@gmail.com in case of any issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
