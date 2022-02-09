import React, { useState, useEffect, useMemo } from 'react';
import { Input, Row, Col, Form } from 'antd';
import axios from 'axios';
//style
import './gallery.css';
import 'antd/dist/antd.css';

const Gallery = () => {

    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const renderImages = useMemo(() => {
        return images.map(image => {
            return (
                <div className='img-cell' key={image.id}>
                    <img className='img' src={image.urls.small} alt={image.id} />
                    <p className='bio'>
                        {image.user.bio}
                    </p>
                </div>
            )
        })
    }, [images]);

    useEffect(() => {
        const fetchImage = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const { data } = await axios.get('https://api.unsplash.com/photos/?client_id=2680e3723c6c767b19a7369175e71cef135d6c7c220e416dd470481f9db84f81');
                setImages(data);
                console.log(data);
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };
        fetchImage();
    }, []);

    const { Search } = Input;
    const [query, setQuery] = useState("");

    const searchImages = async (e) => {
        const { data } = await axios.get('https://api.unsplash.com/photos/?client_id=2680e3723c6c767b19a7369175e71cef135d6c7c220e416dd470481f9db84f81');
        let value = e.target.value;

        if (value && data.length > 0 && value.trim().length > 0) {
            value = value.trim().toLowerCase()
            data.filter(person => {
                const resultsN = person?.user?.bio.includes(value);
                console.log(resultsN);
                return resultsN;
            })
        }
    }

    return (
        <div className="p-5">
            <Row>
                <Col span={9} className='txt'>
                    <h4>Gallery {isLoading && "loading..."} </h4>
                    {isError && <div>Something went wrong...</div>}
                </Col>
                <Col span={10} offset={5} className='txt'>
                    <Form >
                        <Search
                            placeholder="input search text"
                            allowClear
                            enterButton="Search"
                            size="large"
                            name="query"
                            type="text"
                            //value={query}
                            //onChange={searchImages}
                            onMouseOver={searchImages}
                        />
                    </Form>
                    {!isLoading && images.length === 0 && (
                        <h1 className="text-5xl text-center mt-32">No Images found !</h1>
                    )}
                </Col>
            </Row>
            <div className='image-container'>
                {renderImages}
            </div>
        </div>
    );
}

export default Gallery;
