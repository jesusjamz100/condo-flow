import type { JSX } from "react";

interface CardProps {
    children: JSX.Element
}

const Card = ({children}: CardProps) => {
    return (
        <>
        <div className="card">
            {children}
        </div>
        </>
    );
}

export default Card;