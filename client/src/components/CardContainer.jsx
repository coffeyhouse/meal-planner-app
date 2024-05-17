import React from "react"

function CardContainer({children}) {
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    )
}

export default CardContainer;