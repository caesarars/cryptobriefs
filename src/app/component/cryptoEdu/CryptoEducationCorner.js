'use client'

import "./CryptoEducationCorner.css"
import { useRouter } from "next/navigation";

const CryptoEducationCorner = () => {
    const navigate = useRouter()
    const cryptoTips = [
        {
          title: "Blockchain 101: Understanding the Basics",
          description: "Learn how blockchain technology works and why it matters.",
          image: "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/blog_crypto%2Fblockchaintech.jpg?alt=media&token=7957f04d-f325-40d1-9b7a-ed513877e56d",
          link: "/blog/blockchain-101-understanding-the-technology-powering-the-future",
        },
        {
          title: "How to Store Your Crypto Safely",
          description: "Explore wallets, private keys, and how to keep your assets secure.",
          image: "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/blog_crypto%2FFlux_Dev_A_futuristic_digital_illustration_of_a_person_likely__2.jpg?alt=media&token=90605251-0d2a-46d2-aa5c-7730731acb93",
          link: "/blog/how-to-store-your-crypto-safely",
        },
        {
          title: "Smart Contracts Explained Simply",
          description: "No more confusion. Here's what smart contracts do.",
          image: "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/blog_crypto%2Filussmartcontract.jpg?alt=media&token=3c4e89ed-65c7-4f2f-9a57-a88554c31ff7",
          link: "/blog/smart-contracts-made-easy-your-fun-guide-to-blockchains-handy-helpers",
        },
      ];
      

    return (
      <div className="container_crypto_education">
       <p style={{ fontSize: "1.3em", fontWeight: "bold" }} className="p-2 space-title">Crypto Education Corner</p>
        <div className="container_list_edu">
          {cryptoTips.map((tip, index) => (
            <div
              key={index}
              className="container_list_edu general-font"
            >
              <div className="p-3">
                <div className="wrapper_blog_edu">
                  <img src={tip.image} className="image_edu_cover"/>
                  <div className="content_blog_edu">
                    <p className="title_blog_edu">{tip.title}</p>
                    <p className="">{tip.description}</p>
                    <button className="btn btn-warning general-font" onClick={() => navigate(tip.link)}>
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  export default CryptoEducationCorner;