import logo from "../../assets/workhub-logo.png";
import "./Footer.scss";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-inner">

                <div className="footer-brand">

                    <img src={logo} alt="Workhub logo" />

                </div>

                <span className="tagline">
                    Built for focus & flow
                </span>

            </div>

        </footer>
    );
}
