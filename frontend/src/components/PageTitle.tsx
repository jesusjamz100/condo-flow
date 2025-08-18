
interface PageTitleProps {
    title: string
}

const PageTitle = ({title}: PageTitleProps) => {

    return (
        <>
            <p className="text-3xl font-semibold">{title}</p>
        </>
    );
}

export default PageTitle;