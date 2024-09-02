import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import slide1 from './imageSlider/Dark Blue Modern Smart Home Device Setup Facebook Post (1).png';
import slide2 from './imageSlider/White Blue and Orange Modern Home Repair Services Banner Landscape.png';
import slide3 from './imageSlider/Dark Blue Modern Smart Home Device Setup Facebook Post (1).png';

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: '#000000'
};

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '400px'
};

const slideImages = [
  {
    image: slide1,
    caption: 'Slide 1'
  },
  {
    image: slide2,
    caption: 'Slide 2'
  },
  {
    image: slide3,
    caption: 'Slide 3'
  }
];

export default function Slideshow() {
  return (
    <div className="slide-container">
      <Slide>
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            <div className="slide-container">
           <img className='slide-img' src={slideImage.image} alt="Slide 1" style={{ width: '100%'}} />
</div>

          </div>
        ))}
      </Slide>
    </div>
  );
}
