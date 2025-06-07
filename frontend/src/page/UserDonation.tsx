import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import donationHero from '../assets/png/donation-hero.png'; 
import '../css/UserDonation.css';

const UserDonation = () => {
    const [amount, setAmount] = useState("50");
    
    const [receipt, setReceipt] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const userId = localStorage.getItem('userId');
        console.log('Current userId:', userId);
        console.log("888888",localStorage)

        try {
            // 从本地存储获取用户ID
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("Please log in first!");
                return;
            }

            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('amount', amount);
            
            if (receipt) formData.append('receipt', receipt);

            // 发送到后端API
            await axios.post('/donation', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 提交成功后跳转
            navigate('/SuccessDonation');
        } catch (error) {
            console.error('Donation failed:', error);
            alert("Donation submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="donation-page">
            
            <div className="donation-header">
                <h1>Donation</h1>
                <p>
                    Thank you for being a hero to our furry friends! Your support as a Patreon helps us 
                    provide love, care, and a second chance to animals in need. We couldn't do it without you!
                </p>
            </div>

            
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

                    
                    <button 
                        type="submit" 
                        className="donate-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'DONATE'}
                    </button>
                </form>

                
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