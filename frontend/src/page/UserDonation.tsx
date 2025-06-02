import { useState } from "react";
import { Link } from "react-router-dom";
import donationHero from '../assets/png/donation-hero.png'; // 请替换为实际图片路径
import '../css/UserDonation.css';

const UserDonation = () => {
    const [amount, setAmount] = useState("50");
    const [note, setNote] = useState("");
    const [receipt, setReceipt] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ amount, note, receipt });
        // 这里添加实际捐赠逻辑
    };

    return (
        <div className="donation-page">
            {/* 标题和感谢语 */}
            <div className="donation-header">
                <h1>Donation</h1>
                <p>
                    Thank you for being a hero to our furry friends! Your support as a Patreon helps us 
                    provide love, care, and a second chance to animals in need. We couldn't do it without you!
                </p>
            </div>

            {/* 主要内容区 */}
            <div className="donation-main">
                {/* 左侧表单 */}
                <form className="donation-form" onSubmit={handleSubmit}>
                    <h2>Donation Amount</h2>
                    <input 
                        type="text" 
                        value={`RM${amount}`}
                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                        className="amount-input"
                    />

                    <h2>Leave a Small Note</h2>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write something here..."
                        className="note-input"
                    />

                    <h2>Transfer Receipt</h2>
                    <label className="file-upload">
                        Upload ▲
                        <input 
                            type="file" 
                            onChange={(e) => e.target.files && setReceipt(e.target.files[0])}
                            className="file-input"
                        />
                    </label>
                    {receipt && <span className="file-name">{receipt.name}</span>}

                    <button type="submit" className="donate-btn">DONATE</button>
                </form>

                {/* 右侧内容 */}
                <div className="donation-sidebar">
                    <div className="bank-details">
                        <h2>Bank Details</h2>
                        <p>Adopme Shelter <strong>1234123499</strong></p>
                        <p>Maybank</p>
                    </div>
                    <img src={donationHero} alt="Happy pets" className="donation-image" />
                </div>
            </div>

        </div>
    );
};

export default UserDonation;