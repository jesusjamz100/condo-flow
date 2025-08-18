interface LoadingProps {
    text: string
}

const Loading = ({ text }: LoadingProps) => {
    return (
        <>
            <p>{text}</p>
        </>
    );
}

export default Loading;