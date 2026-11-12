import logo from "@/assets/images/jjo-logo-large.svg";

import "./BrandLayout.css";

export default function BrandLayout({ children, footer, intro = false }) {
  return (
    <div className="brand-layout" data-intro={intro}>
      <main className="brand-layout__main">
        <div className="brand-layout__brand">
          <img src={logo} alt="jjo" className="brand-layout__logo" />
          <div className="brand-layout__accent" aria-hidden="true" />
        </div>

        <h1 className="brand-layout__title font-20-semibold">내가 몰랐던 내 말버릇까지</h1>

        <div className="brand-layout__content">{children}</div>
      </main>

      {footer && <div className="brand-layout__bottom">{footer}</div>}
    </div>
  );
}
