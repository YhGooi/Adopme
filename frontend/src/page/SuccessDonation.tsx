import { Link } from "react-router-dom";
import '../css/successdonation.css'; // 我们将创建这个CSS文件

const SuccessDonation = () => {
    return (
        <div className="success-page">
            {/* 顶部标题 */}
            <div className="success-header">
                <h1>Donation Submitted</h1>
                <p>
                    Thank you so much for your support! We will process your donation soon 
                    and it will reflect in your donation histories!
                </p>
            </div>

            {/* 分隔线 */}
            <div className="divider"></div>

            
        </div>
    );
};

export default SuccessDonation;