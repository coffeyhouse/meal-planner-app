import React from "react";

function Heading({ variant, children }) {
    const variants = {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-bold",
        h3: "font-bold text-black/60",
        h4: "font-bold text-sm",
        h5: "text-base font-medium",
        h6: "text-sm font-medium",
    };

    return <p className={variants[variant]}>{children}</p>;
}

export default Heading;
