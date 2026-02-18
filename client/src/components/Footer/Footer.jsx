import logo from "../../assets/workhub-logo.png";
import "./Footer.scss";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="brand">

                    <img src={logo} alt="Workhub logo" />

                </div>

                <span className="tagline">
                    <h2>
                        Built for focus & flow
                    </h2>
                </span>
            </div>
        </footer>
    );
}
