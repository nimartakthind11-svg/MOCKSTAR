import React from 'react';

const FooterSteps = () => {
    return(
        <section className="w-full py-12">
          <div
            className="flex justify-center gap-16 text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            <div>
              <span style={{ color: "var(--accent)" }}>🟤</span>
              {" "}Upload Resume
            </div>

            <div>
              <span style={{ color: "var(--accent)" }}>🟤</span>
              {" "}Practice Live
            </div>

            <div>
              <span style={{ color: "var(--accent)" }}>🟤</span>
              {" "}Get Your Report
            </div>
          </div>
        </section>
    )
}

export default FooterSteps;
