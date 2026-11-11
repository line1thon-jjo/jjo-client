import "./TermsContent.css";

export default function TermsContent({ sections }) {
  return (
    <div className="terms-content">
      {sections.map(({ heading, body }) => (
        <section key={heading} className="terms-content__section">
          <h3 className="terms-content__heading font-15-semibold">{heading}</h3>

          <ul className="terms-content__list">
            {body.map((line) => (
              <li key={line} className="font-14-regular line-height-160">
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
