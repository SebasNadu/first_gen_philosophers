import Carousel from "react-multi-carousel";
import Card42 from "./Card";
import "react-multi-carousel/lib/styles.css";

const CardsCarousel = (props) => {
  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 5,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 3,
      partialVisibilityGutter: 30,
    },
  };

  return (
    <>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {props.data.map((item, index) => (
          <div className="m-4" key={index}>
            <Card42
              title={item.title}
              picture={item.picture}
              user={item.user}
              id={item.id}
              body={item.body}
              active={item.active}
              likes={item.likes}
              comments={item.comments}
              createdAt={item.createdAt}
            />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default CardsCarousel;
