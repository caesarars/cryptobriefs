import { FaArrowDown, FaMinusCircle, FaArrowUp } from "react-icons/fa";

const SentimentProgress = ({ totalBearish, totalNeutral, totalBullish, totalNews }) => {
    const getPercentage = (value) => (totalNews > 0 ? (value / totalNews) * 100 : 0);

    return (
        <div className="container_progress p-2">
            <div className="progress" style={{ height: "24px" , borderRadius:"8px"}}>
                <div className="progress-bar bg-danger" style={{ width: `${getPercentage(totalBearish)}%` }}></div>
                <div className="progress-bar bg-warning" style={{ width: `${getPercentage(totalNeutral)}%` }}></div>
                <div className="progress-bar bg-success" style={{ width: `${getPercentage(totalBullish)}%` }}></div>
            </div>
            
            <div className="d-flex justify-content-around text-center pt-2">
                {[ 
                    { label: "Bearish", value: totalBearish, color: "text-danger", icon: <FaArrowDown className="text-danger"/> },
                    { label: "Neutral", value: totalNeutral, color: "text-warning", icon: <FaMinusCircle className="text-warning"/> },
                    { label: "Bullish", value: totalBullish, color: "text-success", icon: <FaArrowUp className="text-success"/> }
                ].map((item, index) => (
                    <div key={index} className="" >
                        <p className={item.color}>{item.label}</p>
                        <p>{item.value} {item.icon}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentimentProgress;
