'use client'

import "./CryptoEducationCorner.css"
import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link'

const CryptoEducationCorner = () => {

    const [isClicked , setIsClicked] = useState(false)
    
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
        {
          title : "How to Build a Diversified Crypto Portfolio for the Web3 Era",
          description: "We dive deeper into the Web3 revolution. ",
          image : "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/blog_crypto%2FA%20high-resolution%20stock%20photo%20depicting%20a%20dreamy%20atmosphere.%20The%20image%20portrays%20a%20dynamic%2C%20futuristic%20digital%20artwork%20with%20a%20sleek%2C%20neon-lit%20digital%20landscape%20and%20a%20holographic%20dashboard%20displaying%20glowing%20crypto%20assets%20in%20a%203D%20grid.%20%20The%20o.jpg?alt=media&token=116f0b6a-e684-42e7-b1e5-1e5a423a36c9",
          link: "/blog/how-to-build-a-diversified-crypto-portfolio-for-the-web3-era"
        }
      ];
      

    return (
      <div className="container_crypto_education">
       <p style={{ fontSize: "1.3em", fontWeight: "bold" }} className="p-2 space-title">Crypto Education Corner</p>
        <div className="container_list_edu">
          {cryptoTips.map((tip, index) => (
            <article key={tip.link} className="container_list_edu general-font">
              <div className="p-3">
                <div className="wrapper_blog_edu">
                  <Image
                    src={tip.image}
                    alt={`Cover for ${tip.title}`}
                    width={124}
                    height={124}
                    className="image_edu_cover"
                    style={{ borderRadius: "10px", objectFit: "cover" }}
                  />
                  <div className="content_blog_edu">
                    <Link
                      href={tip.link}
                      aria-label={`Read more about ${tip.title} - ${tip.description}`}
                    >
                    <h3 className="title_blog_edu">{tip.title}</h3>
                    </Link>
                    <p>{tip.description}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  };
  

  export default CryptoEducationCorner;