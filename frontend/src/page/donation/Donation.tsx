import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { user_details } from '../../store/auth.store';
import axios from 'axios';
import '../../css/donation/donation.css';
import donationHero from '../../assets/png/DuitnowQR.png';


const Donation = () => {
    const [amount, setAmount] = useState("50");
    
    const [receipt, setReceipt] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    
    const userStore = user_details((state) => state) as any;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const userId = userStore.id;

        try {
            if (!userId) {
                alert("Please log in first!");
                return;
            }            
            
            if (!receipt) {
                alert("Please upload a transfer receipt");
                return;
            }

            const numericAmount = amount.replace(/[^0-9.]/g, '');
            if (!numericAmount || parseFloat(numericAmount) <= 0) {
                alert("Please enter a valid amount greater than 0");
                return;
            }

            const formData = new FormData();
            formData.append('userId', String(userId));
            formData.append('amount', numericAmount);
            formData.append('receipt', receipt);

            console.log('Uploading file:', receipt.name, 'Size:', receipt.size);

            await axios.post('http://localhost:8080/donation', formData, {
                headers: {
                    'Accept': 'application/json',
                },
                maxContentLength: 20 * 1024 * 1024, // 20MB
                maxBodyLength: 20 * 1024 * 1024 // 20MB
            });

            navigate('/donation/success');
        } catch (error) {
            console.error('Donation failed:', error);
            alert("Donation submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="donation-page">
            <div className="donation-title-bar">
                <h2>DONATION</h2>
            </div>
            <div className="donation-container">
                <div className="donation-content">
                    <div className="donation-message">
                        <p>
                            Thank you for being a hero to our furry friends! Your support as a 
                            Patreon helps us provide love, care, and a second chance to 
                            animals in need. We couldn't do it without you!
                        </p>
                    </div>
                    <div className="donation-form-container">
                        <form className="donation-form" onSubmit={handleSubmit}>
                            <div className="donation-form-section">
                                <label>Donation Amount</label>
                                <input 
                                    type="text" 
                                    value={`RM ${amount}`}
                                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="amount-input"
                                />
                            </div>
                            
                            <div className="donation-form-section">
                                <label>Transfer Receipt</label>
                                <label className="file-upload">
                                    Upload ▲
                                    <input 
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 20 * 1024 * 1024) {
                                                    alert("File size must be less than 20MB");
                                                    e.target.value = '';
                                                } else {
                                                    setReceipt(file);
                                                }
                                            }
                                        }}
                                        className="file-input"
                                    />
                                </label>
                                <p className="file-requirements">
                                    Accepted formats: JPEG, PNG, GIF, PDF • Max size: 20MB • Clear, legible transfer receipt recommended
                                </p>
                                {receipt && <span className="file-name">{receipt.name}</span>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="donate-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'PROCESSING...' : 'DONATE'}
                            </button>
                        </form>
                    
                        <div className="vertical-divider"></div>
                        
                        <div className="bank-details">
                            <h3>Bank Details</h3>
                            <p>Adopme Shelter</p>
                            <p>1234371699</p>
                            <p>Maybank</p>
                            <img src={donationHero} alt="Duitnow QR" className="donation-image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donation;