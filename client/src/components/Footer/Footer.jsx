import "./Footer.scss";
import logo from "../../../public/workhub-logo.png"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="brand">


                    <img src={logo} alt="WorkHub Logo" className="logo" />

                </div>
                <span className="tagline">Built for focus & flow</span>
            </div>
        </footer>
    );
}
