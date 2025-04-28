'use client'

import ListAirdrops from "./ListAirdrops";

const Airdrops = () => {
    return (
        <>
           <h1 className="m-4 text-center space-title">Latest Airdrops</h1>
            <div className="general-font" style={{width:"50%" , margin: "0 auto", textAlign:"center"}}>
                Airdrops are free crypto giveaways straight to your wallet! 🚀 Projects use them to reward early supporters, build hype, and grow their community — sometimes all you need to do is sign up or complete simple tasks.
            </div>
            <ListAirdrops/>
        </>
    )
}

export default Airdrops;