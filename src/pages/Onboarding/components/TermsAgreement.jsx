import AgreementCheckbox from "./AgreementCheckbox";
import chevronRight from "../../../assets/icons/chevron-right.svg";

import "./TermsAgreement.css";

export default function TermsAgreement({ terms, agreements, onChange, onOpenTerm }) {
  const isAllAgreed = terms.every((term) => agreements[term.id]);

  const handleAllChange = (checked) => {
    onChange(Object.fromEntries(terms.map((term) => [term.id, checked])));
  };

  const handleTermChange = (id, checked) => {
    onChange({ ...agreements, [id]: checked });
  };

  return (
    <section className="terms-agreement" aria-label="약관 동의">
      <AgreementCheckbox label="약관 전체 동의" checked={isAllAgreed} onChange={handleAllChange} emphasized />

      <hr className="terms-agreement__divider" />

      <ul className="terms-agreement__list">
        {terms.map((term) => (
          <li key={term.id} className="terms-agreement__item">
            <AgreementCheckbox
              label={`[${term.required ? "필수" : "선택"}] ${term.label}`}
              checked={Boolean(agreements[term.id])}
              onChange={(checked) => handleTermChange(term.id, checked)}
            />

            <button
              type="button"
              className="terms-agreement__detail"
              onClick={() => onOpenTerm?.(term.id)}
              aria-label={`${term.label} 보기`}
            >
              <img src={chevronRight} alt="" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
