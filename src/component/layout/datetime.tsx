
import react, { useEffect, useState } from "react";

const DateTime = () => {
    const [dateTime, setDateTime] = useState(new Date());


    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(intervalId); // Dọn dẹp khi component bị unmount
    }, []);

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };
    const formattedDateTime = dateTime.toLocaleDateString("en-US", options);

    return (
        <>
            <p>{formattedDateTime}</p>
        </>
    )
}

export default DateTime