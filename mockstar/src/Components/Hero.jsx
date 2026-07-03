import React from 'react';

const Hero = ({ onStartPractice }) => {
    return (
      <section className="flex-1 text-center flex flex-col justify-center px-6 my-10">
          <h1
            className="max-w-4xl mx-auto text-7xl leading-tight font-serif"
            style={{ color: "var(--text-primary)" }}
          >
            Practice the interview before it's the real one.
          </h1>

          <p
            className="max-w-xl mx-auto mt-5 text-lg"
            style={{ color: "var(--text-muted)" }}
          >
            Upload your resume. Get matched questions.
            See exactly how the conversation went,
            every time.
          </p>

          <button
            onClick={onStartPractice}
            className="mt-10 mx-auto px-8 py-3.5 rounded-md font-semibold text-lg hover:scale-105 active:scale-98 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
            style={{ background: "var(--accent)", color: "#F4F5F2" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
          >
            Start practicing →
          </button>
        </section>
    )
}

export default Hero;