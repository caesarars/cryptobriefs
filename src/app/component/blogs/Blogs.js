'use client'
import { useState, useEffect } from 'react'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./Blogs.css";


const Blogs = () => {
    const [blogs ,setBlogs] = useState([])
    const [isLoading ,setIsLoading] = useState(false)
    const navigate = useRouter();
    const [isClicked , setIsClicked] = useState(false)

    const getBlogs = async () => {
        setIsLoading(true)

        const queryParams = new URLSearchParams({
            order: 'desc',  // Bisa 'asc' atau 'desc'
            page: 1,
            limit: 5
        }).toString(); 
  
        const response = await fetch(`https://crypto-blog-backend.vercel.app/api/getBlog?${queryParams}`);
        const data = await response.json();
        setBlogs(data.data)
        setIsLoading(false)
    }

    useEffect(() => {
        getBlogs()
    },[])

    const gotoDetail = (link) => { 
        router.push('/blog/'+link)
    }

    const getContentText = (parsedContent) => {
      // Ambil dari section jika ada, jika tidak, coba dari sections
      const contentSource = parsedContent.section?.length
        ? parsedContent.section
        : parsedContent.sections?.length
        ? parsedContent.sections
        : [];
    
      // Ambil teks pertama jika ada, kalau tidak kosongkan string
      const text = contentSource.length > 0 ? contentSource[0].text : "";
    
      // Bersihkan tag HTML
      return text.replace(/<\/?[^>]+(>|$)/g, "");
    };

    return (
        <>
            {isLoading ? (
                <p className="loadingText">Loading Blog...</p>
            ) : (
              <>
                <div className="container pt-2 pb-2 text-start">
                  <h1 className="pt-4 pb-2 space-title">Articles</h1>
                </div>
                <div className="container main_container">
                  <div className="main_card">
                    {blogs.slice(0,1).map((item, index) => {
                      const parsedContent = JSON.parse(item.content); 
                      const getFirstSecion = getContentText(parsedContent)
                      return (
                        <div key={index}>
                            <Link href={`/blog/${item.slug}`} aria-label={`Read more about ${item.title}`} passHref>
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={800} // bebas, sebagai estimasi default
                              height={220} // karena di CSS kamu set height: 220px
                              className="image_main_card"
                              style={{
                                objectFit: "cover",
                                borderRadius: "16px",
                              }}
                              loading="lazy"
                            />
                            </Link>
                              <div className="content_custom">
                                  <h1 className="newsTitle" onClick={()=>gotoDetail(item.slug)}>
                                    {parsedContent.plain_title ?parsedContent.plain_title.replace(/<\/?[^>]+(>|$)/g, "") : parsedContent.title.replace(/<\/?[^>]+(>|$)/g, "") }</h1>
                                  <p style={{textAlign:"justify", color:"black"}}>
                                    {getFirstSecion}
                                  </p>
                                  <p className='date_custom' >{new Date(item.created_at).toLocaleString()}</p>
                                  <a className='btn btn-glow' onClick={() => setIsClicked(true)}>
                                    <Link href={`/blog/${item.slug}`} aria-label={`Read more about ${item.title}`} passHref>
                                      { isClicked ? <span>Loading...</span>: <span>Read more</span>}
                                    </Link>
                                  </a>
                              </div>
                          </div>
                      )
                          
                      })}
                  </div>
                  
                  <div className="secondary_blog">
                    {blogs.slice(1,5).map((item, index) => {
                      const parsedContent = JSON.parse(item.content)
                      return (
                      <div className="d-flex container_second_blog" key={index}> 
                        <div className="d-flex align-items-center">
                        <Link href={`/blog/${item.slug}`} aria-label={`Read more about ${item.title}`} passHref>
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={120}
                            height={72}
                            className="image_non_main"
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            loading="lazy"
                          />
                        </Link>
                            </div>
                        <a className="link_element" onClick={()=>gotoDetail(item.slug)} aria-label={`Read more about ${item.title}`}>
                            {parsedContent.plain_title ?parsedContent.plain_title.replace(/<\/?[^>]+(>|$)/g, "") : parsedContent.title.replace(/<\/?[^>]+(>|$)/g, "")} 
                        </a>
                      </div> 
                      )
                  })}
                    <a className='btn btn-glow' style={{backgroundColor:"#6a1b9a" , color:"white"}} href="/blogs" >
                      Find More Articles &nbsp; <FontAwesomeIcon icon={faArrowRight}/> 
                    </a>
                  </div>
                </div>           
            </>
          )}
      </>
  )
}

export default Blogs;